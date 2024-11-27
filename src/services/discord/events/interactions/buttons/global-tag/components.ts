import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export function globalTagButton() {
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`global_tag`)
      .setEmoji('🏷️')
      .setLabel('Enter Tag')
      .setStyle(ButtonStyle.Primary),
  );

  return row;
}
