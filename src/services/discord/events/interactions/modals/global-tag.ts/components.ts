import { TextInputBuilder } from '@discordjs/builders';
import { ActionRowBuilder, ModalBuilder, TextInputStyle } from 'discord.js';

export function globalTagModal() {
  const component = new TextInputBuilder()
    .setCustomId(`tag`)
    .setLabel('Enter your tag')
    .setPlaceholder('Type your tag here')
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true)
    .setMinLength(2)
    .setMaxLength(10);

  const row = new ActionRowBuilder<TextInputBuilder>().addComponents(component);
  const modal = new ModalBuilder()
    .setTitle('NTWRK Global Tag')
    .setCustomId(`global_tag`)
    .addComponents([row]);

  return modal;
}
