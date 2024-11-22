import ChannelCache from 'src/lib/utils/channelCache';
import { CommandHandler } from '.';
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { getGuild } from 'src/lib/data/guilds/getGuild';
import { insertGuild } from 'src/lib/data/guilds/insertGuild';
import { updateGuild } from 'src/lib/data/guilds/updateGuild';
import { EmbedUtils } from 'src/lib/utils/embeds';

export default class GlobalTagCommand implements CommandHandler {
  name = 'global-tag';
  commandBuilder = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription("Set this server's global tag.")
    .addStringOption((option) =>
      option
        .setName('tag')
        .setDescription('The tag to set.')
        .setRequired(true)
        .setMinLength(1)
        .setMaxLength(10),
    );

  options = {
    requiresAdmin: true,
    requiresGuild: true,
    deferReply: true,
  };

  process = async (interaction: ChatInputCommandInteraction<'cached'>) => {
    const tag = interaction.options.getString('tag') as string;
    const guild = await getGuild(interaction.guildId);
    if (!guild) {
      await insertGuild({
        id: interaction.guildId,
        name: interaction.guild.name,
        icon_url: interaction.guild.iconURL() || null,
        tag,
      });
    } else {
      await updateGuild(interaction.guildId, { tag });
    }
    await interaction.reply({
      embeds: [EmbedUtils.Success(`Global tag set to [${tag.toUpperCase()}].`)],
      ephemeral: true,
    });
  };
}
