import { TextInputBuilder } from '@discordjs/builders';
import { ActionRowBuilder, ModalBuilder, TextInputStyle } from 'discord.js';
import { InputRow } from 'src/lib/types/input';

export function getInputModal(input: InputRow) {
  const component = new TextInputBuilder()
    .setCustomId(`answer`)
    .setLabel(input.question)
    .setPlaceholder('Type your answer here')
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true)
    .setMinLength(1);

  const row = new ActionRowBuilder<TextInputBuilder>().addComponents(component);
  const modal = new ModalBuilder()
    .setTitle('NTWRK Global Survey')
    .setCustomId(`input_${input.id}`)
    .addComponents([row]);

  return modal;
}
