import { ButtonInteraction } from 'discord.js';
import { ButtonHandler } from '..';
import { EmbedUtils } from 'src/lib/utils/embeds';
import { getGuild } from 'src/lib/data/guilds/getGuild';
import { globalTagModal } from '../../modals/global-tag.ts/components';

export default class GlobalTagButtonHandler implements ButtonHandler {
  customId = 'global_tag';
  options = {
    deferReply: false,
  };

  process = async (interaction: ButtonInteraction): Promise<void> => {
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
