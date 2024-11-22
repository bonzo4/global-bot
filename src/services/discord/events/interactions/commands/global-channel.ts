import {
  channelMention,
  ChannelType,
  ChatInputCommandInteraction,
  Guild,
  SlashCommandBuilder,
  SnowflakeUtil,
} from 'discord.js';
import { CommandHandler } from '.';
import { getGuild } from 'src/lib/data/guilds/getGuild';
import { insertGuild } from 'src/lib/data/guilds/insertGuild';
import { getGuildChannels } from 'src/lib/data/channels/getGuildChannels';
import { EmbedUtils } from 'src/lib/utils/embeds';
import { getGuildChannelAccess } from 'src/lib/data/channels/getGuildChannelAccess';
import { ChannelAccess } from 'src/lib/types/channels';
import { insertGlobalChannel } from 'src/lib/data/channels/insertGlobalChannel';
import TickerText from 'src/lib/utils/tickerText';
import RequiredPermissions from 'src/lib/utils/permissions';
import ChannelCache from 'src/lib/utils/channelCache';
import { createGlobalWebhook } from 'src/lib/utils/webhooks';

export default class GlobalChannelCommand implements CommandHandler {
  constructor(private readonly channelCache: ChannelCache) {}

  name = 'global-channel';
  commandBuilder = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription('Setup a global channel for the server.')
    .addStringOption((option) =>
      option
        .setName('access')
        .setDescription(
          'If you have whitelist or superteam access, select it here.',
        )
        .addChoices([
          { name: 'General', value: 'general' },
          { name: 'Whitelist', value: 'whitelist' },
          { name: 'Superteam', value: 'superteam' },
        ])
        .setRequired(false),
    );
  options = {
    requiresAdmin: true,
    requiresGuild: true,
    deferReply: true,
    requiredPermissions: [RequiredPermissions.globalPermissions],
  };

  process = async (interaction: ChatInputCommandInteraction<'cached'>) => {
    const selectedAccess =
      (interaction.options.getString('access') as ChannelAccess) || 'general';

    let guildData = await getGuild(interaction.guildId);

    if (!guildData) {
      guildData = await insertGuild({
        id: interaction.guildId,
        name: interaction.guild.name,
        icon_url: interaction.guild.iconURL() || null,
      });
    }

    const channelAccess = await getGuildChannelAccess(interaction.guildId);
    const globalChannels = await getGuildChannels(interaction.guildId);

    const hasAccess =
      channelAccess.some(
        (access) => access.channel_access === selectedAccess,
      ) || !selectedAccess;

    if (selectedAccess !== 'general' && !hasAccess) {
      await interaction.followUp({
        embeds: [
          EmbedUtils.Warning(
            `This server doesn't have access to the ${selectedAccess} channel.`,
          ),
        ],
        ephemeral: true,
      });
      return;
    }

    if (globalChannels.length >= 3) {
      await interaction.followUp({
        embeds: [
          EmbedUtils.Warning('You can only have up to 3 global channels.'),
        ],
        ephemeral: true,
      });
      return;
    }

    const globalChannel = await this.createGlobalChannel(interaction.guild);
    const webhook = await createGlobalWebhook(globalChannel);

    await insertGlobalChannel({
      guild_id: interaction.guildId,
      id: globalChannel.id,
      channel_access: selectedAccess,
      webhook_url: webhook.url,
    });

    this.channelCache.addGlobalChannel(globalChannel.id);

    const nonce = SnowflakeUtil.generate().toString();
    await webhook.send({
      embeds: [EmbedUtils.WelcomeMessage(globalChannel.guild, selectedAccess)],
      username: 'Global Message',
      avatarURL:
        'https://fendqrkqasmfswadknjj.supabase.co/storage/v1/object/public/pfps/GlobalDiscordLogo.png',
      options: {
        enforceNonce: true,
        nonce,
      },
    });

    await interaction.followUp({
      embeds: [
        EmbedUtils.Success(
          `Global channel created at ${channelMention(globalChannel.id)} with access to ${selectedAccess}.`,
        ),
      ],
      ephemeral: true,
    });
  };

  private async createGlobalChannel(guild: Guild) {
    const channel = await guild.channels.create({
      name: '⚪️┃global-chat',
      type: ChannelType.GuildText,
      topic: TickerText.defaultTicker,
      permissionOverwrites: [
        {
          id: process.env.DISCORD_ID!,
          allow: RequiredPermissions.globalPermissions,
        },
        {
          id: guild.roles.everyone.id,
          deny: ['ViewChannel'],
        },
      ],
    });

    return channel;
  }
}
