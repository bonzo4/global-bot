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
import ChannelCache from 'src/lib/utils/channelCache';
import { deleteGlobalChannel } from 'src/lib/data/channels/deleteGlobalChannel';

export default class DisableGlobalChannelCommand implements CommandHandler {
  constructor(private readonly channelCache: ChannelCache) {}

  name = 'disable-global-channel';
  commandBuilder = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription('Disable this Global Channel.')
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('Select the global channel to disable.')
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

    const channelExists = globalChannels.some(
      (channel) => channel.id === selectedChannel?.id,
    );

    if (!channelExists) {
      await interaction.followUp({
        embeds: [
          EmbedUtils.Warning('The selected channel is not a global channel.'),
        ],
        ephemeral: true,
      });
      return;
    }

    await deleteGlobalChannel(selectedChannel.id);

    this.channelCache.removeGlobalChannel(selectedChannel.id);

    await interaction.followUp({
      embeds: [
        EmbedUtils.Success(
          `The channel ${channelMention(selectedChannel.id)} is no longer a global channel.`,
        ),
      ],
      ephemeral: true,
    });
  };
}
