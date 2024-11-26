import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { LinkRow } from 'src/lib/types/links';

export function linkButton(link: LinkRow) {
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setLabel(link.label)
      .setStyle(ButtonStyle.Link)
      .setURL(link.url),
  );

  return row;
}
