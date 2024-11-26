import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { InputRow } from 'src/lib/types/input';

export function inputButton(input: InputRow) {
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`input_${input.id}`)
      .setLabel('Answer')
      .setStyle(ButtonStyle.Primary),
  );

  return row;
}
