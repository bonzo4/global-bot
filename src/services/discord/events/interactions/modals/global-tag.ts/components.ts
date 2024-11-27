import { TextInputBuilder } from '@discordjs/builders';
import { ActionRowBuilder, ModalBuilder, TextInputStyle } from 'discord.js';

export function globalTagModal(hasTag: boolean) {
  const component = new TextInputBuilder()
    .setCustomId(`tag`)
    .setLabel(`${hasTag ? 'Update' : 'Set'} your servers tag`)
    .setPlaceholder('Type your tag here')
    .setStyle(TextInputStyle.Short)
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
