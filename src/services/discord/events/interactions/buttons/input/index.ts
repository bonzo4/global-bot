import { ButtonInteraction } from 'discord.js';
import { ButtonHandler } from '..';
import { fetchUser } from 'src/lib/data/users/fetchUser';
import { getInput } from 'src/lib/data/input/getInput';
import { EmbedUtils } from 'src/lib/utils/embeds';
import { getEmbed } from 'src/lib/data/embed/getEmbed';
import { getInputInteractions } from 'src/lib/data/input/getInputInteractions';
import { getInputModal } from '../../modals/input/components';

export default class InputButtonHandler implements ButtonHandler {
  customId = 'input';
  options = {
    deferReply: false,
  };

  process = async (interaction: ButtonInteraction<'cached'>): Promise<void> => {
    await fetchUser(interaction.user);

    const [, inputId] = interaction.customId.split('_');

    const input = await getInput(parseInt(inputId, 10));

    if (!input) {
      await interaction.reply({
        embeds: [EmbedUtils.Warning('Input not found.')],
        ephemeral: true,
      });
      return;
    }

    const embed = await getEmbed(input.embed_id);
    if (!embed) {
      await interaction.reply({
        embeds: [EmbedUtils.Warning('Input not found.')],
        ephemeral: true,
      });
      return;
    }

    const inputInteractions = await getInputInteractions(
      input.id,
      interaction.user.id,
    );

    const inputInteraction = inputInteractions.find(
      (interaction) => interaction.input !== null,
    );

    if (inputInteraction) {
      await interaction.reply({
        embeds: [EmbedUtils.Warning('You have already answered this input.')],
        ephemeral: true,
      });
      return;
    }

    await interaction.showModal(getInputModal(input));
  };
}
