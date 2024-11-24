import { EmbedRow } from 'src/lib/types/embed';
import { getEmbedPolls } from '../poll/getEmbedPolls';
import { Poll, PollChoice } from 'src/lib/types/poll';
import { getPollChoices } from '../poll/getPollChoices';

export type EmbedButton = {
  type: 'poll';
  data: { poll: Poll; pollChoices: PollChoice[] };
};

export async function getEmbedButtons(embed: EmbedRow): Promise<EmbedButton[]> {
  const buttons = await Promise.all(
    embed.interaction_types.map(async (interactionType) => {
      switch (interactionType) {
        case 'POLL': {
          const pollRows = await getEmbedPolls(embed.id);
          const polls = await Promise.all(
            pollRows.map(async (poll) => {
              const pollChoices = await getPollChoices(poll.id);
              return { poll, pollChoices };
            }),
          );
          return polls.map(({ poll, pollChoices }) => ({
            type: 'poll' as const,
            data: { poll, pollChoices },
          }));
        }
        default:
          return [];
      }
    }),
  );
  return buttons.flat();
}
