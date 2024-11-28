import ChannelCache from 'src/lib/utils/channelCache';
import { CommandHandler } from '.';
import {
  channelMention,
  ChannelType,
  ChatInputCommandInteraction,
  Guild,
  SlashCommandBuilder,
  SnowflakeUtil,
} from 'discord.js';
import RequiredPermissions from 'src/lib/utils/permissions';
import { getGuild } from 'src/lib/data/guilds/getGuild';
import { insertGuild } from 'src/lib/data/guilds/insertGuild';
import { getGuildChannels } from 'src/lib/data/channels/getGuildChannels';
import { EmbedUtils } from 'src/lib/utils/embeds';
import TickerText from 'src/lib/utils/tickerText';
import { createGlobalWebhook } from 'src/lib/utils/webhooks';
import { insertGlobalChannel } from 'src/lib/data/channels/insertGlobalChannel';
import { getGuildChannelAccess } from 'src/lib/data/channels/getGuildChannelAccess';
import { globalTagButton } from '../buttons/global-tag/components';

export default class GlobalSuperteamCommand implements CommandHandler {
  constructor(private readonly channelCache: ChannelCache) {}

  name = 'global-superteam';
  commandBuilder = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription('Setup a Global Superteam Channel for the server.');

  options = {
    requiresAdmin: true,
    requiresGuild: true,
    deferReply: true,
    requiredPermissions: [RequiredPermissions.globalPermissions],
  };

  process = async (interaction: ChatInputCommandInteraction<'cached'>) => {
    let guildData = await getGuild(interaction.guildId);

    if (!guildData) {
      guildData = await insertGuild({
        id: interaction.guildId,
        name: interaction.guild.name,
        icon_url: interaction.guild.iconURL() || null,
      });
    }

    const globalChannels = await getGuildChannels(interaction.guildId);
    const channelAccess = await getGuildChannelAccess(interaction.guildId);

    const hasAccess = channelAccess.some(
      (access) => access.channel_access === 'superteam',
    );

    if (!hasAccess) {
      await interaction.followUp({
        embeds: [
          EmbedUtils.Warning(
            `This server doesn't have access to the Superteam channel.`,
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

    const channel = await this.createGlobalSuperteamChannel(interaction.guild);
    const webhook = await createGlobalWebhook(channel);

    await insertGlobalChannel({
      guild_id: interaction.guildId,
      id: channel.id,
      channel_access: 'superteam',
      webhook_url: webhook.url,
    });

    this.channelCache.addGlobalChannel(channel.id);

    const nonce = SnowflakeUtil.generate().toString();
    await webhook.send({
      embeds: [
        EmbedUtils.WelcomeMessage(
          channel.guild,
          'superteam',
          Boolean(guildData.tag),
        ),
      ],
      components: guildData.tag ? [] : [globalTagButton()],
      username: 'Global Message',
      avatarURL:
        'https://fendqrkqasmfswadknjj.supabase.co/storage/v1/object/public/pfps/GlobalDiscordLogo.png',
      options: {
        enforceNonce: true,
        nonce,
      },
      enforceNonce: true,
    });

    await interaction.followUp({
      embeds: [
        EmbedUtils.Success(
          `Global channel created at ${channelMention(channel.id)} with access to Superteam Chat. ${guildData.tag ? '' : 'Please create a tag for your sever now.'}`,
        ),
      ],
      ephemeral: true,
    });
  };

  private async createGlobalSuperteamChannel(guild: Guild) {
    const channel = await guild.channels.create({
      name: '⚪️┃global-superteam-chat',
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
