import { EmbedRow } from 'src/lib/types/embed';
import { getEmbedPolls } from '../poll/getEmbedPolls';
import { Poll, PollChoice } from 'src/lib/types/poll';

export type EmbedButton = { type: 'poll'; pollChoices: PollChoice[] };

export async function getEmbedButtons(embed: EmbedRow) {
  const buttons = await Promise.all(
    embed.interaction_types.map(async (interactionType) => {
      switch (interactionType) {
        case 'POLL':
          return await getEmbedPolls(embed.id);
        default:
          return [];
      }
    }),
  );
  return buttons.flat();
}
