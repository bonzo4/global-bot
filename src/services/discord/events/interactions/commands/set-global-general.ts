import ChannelCache from 'src/lib/utils/channelCache';
import { CommandHandler } from '.';
import {
  channelMention,
  ChannelType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SnowflakeUtil,
  TextChannel,
  WebhookClient,
} from 'discord.js';
import { insertGuild } from 'src/lib/data/guilds/insertGuild';
import { getGuild } from 'src/lib/data/guilds/getGuild';
import { getGuildChannels } from 'src/lib/data/channels/getGuildChannels';
import { EmbedUtils } from 'src/lib/utils/embeds';
import RequiredPermissions from 'src/lib/utils/permissions';
import { createGlobalWebhook } from 'src/lib/utils/webhooks';
import { updateGlobalChannel } from 'src/lib/data/channels/updateGlobalChannel';
import { insertGlobalChannel } from 'src/lib/data/channels/insertGlobalChannel';
import { globalTagButton } from '../buttons/global-tag/components';

export default class SetGlobalGeneralCommand implements CommandHandler {
  constructor(private readonly channelCache: ChannelCache) {}

  name = 'set-global-general';
  commandBuilder = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription('Set a channel to become a Global General Channel.')
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('Select a channel for global chat.')
        .setRequired(true)
        .addChannelTypes([ChannelType.GuildText]),
    );

  options = {
    requiresAdmin: true,
    requiresGuild: true,
    deferReply: true,
  };

  process = async (interaction: ChatInputCommandInteraction<'cached'>) => {
    const selectedChannel = interaction.options.getChannel(
      'channel',
    ) as TextChannel;

    let guildData = await getGuild(interaction.guildId);

    if (!guildData) {
      guildData = await insertGuild({
        id: interaction.guildId,
        name: interaction.guild.name,
        icon_url: interaction.guild.iconURL() || null,
      });
    }

    const globalChannels = await getGuildChannels(interaction.guildId);

    const selectedGlobalChannel = globalChannels.find(
      (channel) => channel.id === selectedChannel.id,
    );

    if (
      selectedGlobalChannel &&
      selectedGlobalChannel.channel_access === 'general'
    ) {
      await interaction.followUp({
        embeds: [
          EmbedUtils.Warning(
            'This channel is already set as a global channel with access to General.',
          ),
        ],
        ephemeral: true,
      });
      return;
    }

    // Limit the number of global channels
    if (!selectedGlobalChannel && globalChannels.length >= 3) {
      await interaction.followUp({
        embeds: [
          EmbedUtils.Warning('You can only have up to 3 global channels.'),
        ],
        ephemeral: true,
      });
      return;
    }

    // Check required permissions for the bot in the selected channel
    const permissions = selectedChannel.permissionsFor(
      await selectedChannel.guild.members.fetchMe(),
    );
    const missingPermissions = permissions.missing(
      RequiredPermissions.globalPermissions,
    );

    if (missingPermissions.length) {
      await interaction.followUp({
        embeds: [
          EmbedUtils.Warning(
            'The bot does not have the required permissions to send messages in this channel.\n\nThe following permissions are still required:\n\n' +
              missingPermissions.join('\n'),
          ),
        ],
        ephemeral: true,
      });
      return;
    }

    // Create webhook if needed and update the database
    const webhook = selectedGlobalChannel
      ? new WebhookClient({ url: selectedGlobalChannel.webhook_url })
      : await createGlobalWebhook(selectedChannel);

    if (!selectedGlobalChannel) {
      await insertGlobalChannel({
        guild_id: interaction.guildId,
        id: selectedChannel.id,
        channel_access: 'general',
        webhook_url: webhook?.url || '',
      });

      this.channelCache.addGlobalChannel(selectedChannel.id);
    } else if (selectedGlobalChannel.channel_access !== 'general') {
      // Update the access level if it's different
      await updateGlobalChannel(selectedChannel.id, {
        channel_access: 'general',
      });
    }

    const nonce = SnowflakeUtil.generate().toString();
    await webhook.send({
      embeds: [
        EmbedUtils.WelcomeMessage(
          selectedChannel.guild,
          'general',
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
    });

    await interaction.followUp({
      embeds: [
        EmbedUtils.Success(
          `The channel ${channelMention(selectedChannel.id)} has been set as a global channel with access to General.`,
        ),
      ],
      components: guildData.tag ? [] : [globalTagButton()],
      ephemeral: true,
    });
  };
}
