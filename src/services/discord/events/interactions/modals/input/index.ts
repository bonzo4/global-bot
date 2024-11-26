import { ModalSubmitInteraction } from 'discord.js';
import { ModalHandler } from '..';
import { EmbedUtils } from 'src/lib/utils/embeds';
import { insertInputInteraction } from 'src/lib/data/input/insertInputInteraction';
import { getEmbed } from 'src/lib/data/embed/getEmbed';
import { getInput } from 'src/lib/data/input/getInput';

export default class InputModalHandler implements ModalHandler {
  customId = 'input';
  options = {
    deferReply: true,
  };

  process = async (interaction: ModalSubmitInteraction): Promise<void> => {
    if (!interaction.guild) {
      await interaction.followUp({
        embeds: [
          EmbedUtils.Warning('This command is only available in a server.'),
        ],
        ephemeral: true,
      });
      return;
    }
    const answer = interaction.fields.getField('answer').value;

    if (!answer) {
      await interaction.followUp({
        embeds: [EmbedUtils.Warning('Please provide an answer.')],
        ephemeral: true,
      });
      return;
    }

    const [, inputId] = interaction.customId.split('_');

    const input = await getInput(parseInt(inputId, 10));

    if (!input) {
      await interaction.followUp({
        embeds: [EmbedUtils.Warning('Input not found.')],
        ephemeral: true,
      });
      return;
    }

    const embed = await getEmbed(input.embed_id);
    if (!embed) {
      await interaction.followUp({
        embeds: [EmbedUtils.Warning('Input not found.')],
        ephemeral: true,
      });
      return;
    }

    await insertInputInteraction({
      guild_id: interaction.guild.id,
      user_id: interaction.user.id,
      message_id: embed.message_id,
      input_id: input.id,
      input: answer,
    });

    await interaction.followUp({
      embeds: [EmbedUtils.Success('Answer submitted successfully.')],
      ephemeral: true,
    });
  };
}
