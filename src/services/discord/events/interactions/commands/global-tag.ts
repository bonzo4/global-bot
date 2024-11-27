import ChannelCache from 'src/lib/utils/channelCache';
import { CommandHandler } from '.';
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { getGuild } from 'src/lib/data/guilds/getGuild';
import { insertGuild } from 'src/lib/data/guilds/insertGuild';
import { updateGuild } from 'src/lib/data/guilds/updateGuild';
import { EmbedUtils } from 'src/lib/utils/embeds';
import { globalTagModal } from '../modals/global-tag.ts/components';

export default class GlobalTagCommand implements CommandHandler {
  name = 'global-tag';
  commandBuilder = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription("Set this server's global tag.");

  options = {
    requiresAdmin: true,
    requiresGuild: true,
    deferReply: false,
  };

  process = async (interaction: ChatInputCommandInteraction<'cached'>) => {
    const guild = interaction.guild;

    if (!guild) {
      await interaction.reply({
        embeds: [
          EmbedUtils.Warning('This command can only be used in a server.'),
        ],
      });
      return;
    }

    let guildRow = await getGuild(guild.id);

    if (!guildRow) {
      await interaction.reply({
        embeds: [
          EmbedUtils.Warning(
            'An error occurred while fetching the server data.',
          ),
        ],
      });
      return;
    }

    await interaction.showModal(globalTagModal());
  };
}
