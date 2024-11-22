import {
  channelMention,
  ChannelType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  TextChannel,
} from 'discord.js';
import { CommandHandler } from '.';
import { getGuild } from 'src/lib/data/guilds/getGuild';
import { insertGuild } from 'src/lib/data/guilds/insertGuild';
import { getGuildChannels } from 'src/lib/data/channels/getGuildChannels';
import { EmbedUtils } from 'src/lib/utils/embeds';
import { getGuildChannelAccess } from 'src/lib/data/channels/getGuildChannelAccess';
import RequiredPermissions from 'src/lib/utils/permissions';
import { createGlobalWebhook } from 'src/lib/utils/webhooks';
import { updateGlobalChannel } from 'src/lib/data/channels/updateGlobalChannel';

export default class FixGlobalChannelCommand implements CommandHandler {
  name = 'fix-global-channel';
  commandBuilder = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription('Setup the bot for the server.')
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

    const channelAccess = await getGuildChannelAccess(interaction.guildId);
    const globalChannels = await getGuildChannels(interaction.guildId);
    const selectGlobalChannel = globalChannels.find(
      (channel) => channel.id === selectedChannel.id,
    );

    if (!selectGlobalChannel) {
      await interaction.followUp({
        embeds: [
          EmbedUtils.Warning(
            `The channel ${channelMention(selectedChannel.id)} is not a global channel.`,
          ),
        ],
        ephemeral: true,
      });
      return;
    }
    const hasAccess = channelAccess.some(
      (access) => selectGlobalChannel?.channel_access === access.channel_access,
    );

    if (!hasAccess) {
      await interaction.followUp({
        embeds: [
          EmbedUtils.Warning(
            `The channel ${channelMention(selectedChannel.id)} does not have access to ${selectGlobalChannel.channel_access} anymore.\n\nPlease renew your subscription or switch back to general access using **/messageCreate**.`,
          ),
        ],
        ephemeral: true,
      });
      return;
    }

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

    const webhooks = await selectedChannel.fetchWebhooks();
    let webhook = webhooks.find(
      (webhook) => webhook.url === selectGlobalChannel.webhook_url,
    );

    if (!webhook) {
      webhook = await createGlobalWebhook(selectedChannel);

      await updateGlobalChannel(selectedChannel.id, {
        webhook_url: webhook.url,
      });
    }

    await interaction.followUp({
      embeds: [
        EmbedUtils.Success(
          `The channel ${channelMention(selectedChannel.id)} is setup properly.`,
        ),
      ],
      ephemeral: true,
    });
  };
}
