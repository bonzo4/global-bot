import { EmbedRow } from 'src/lib/types/embed';
import { getEmbedPolls } from '../poll/getEmbedPolls';
import { Poll, PollChoice } from 'src/lib/types/poll';
import { getPollChoices } from '../poll/getPollChoices';
import { getEmbedInputs } from '../input/getEmbedInputs';
import { Quiz, QuizChoice } from 'src/lib/types/quiz';
import { InputRow } from 'src/lib/types/input';
import { getEmbedQuizzes } from '../quiz/getEmbedQuizzes';
import { getQuizChoices } from '../quiz/getQuizChoices';
import { getEmbedLinks } from '../link/getEmbedLinks';
import { LinkRow } from 'src/lib/types/links';

export type EmbedButton =
  | {
      type: 'poll';
      data: { poll: Poll; pollChoices: PollChoice[] };
    }
  | {
      type: 'quiz';
      data: { quiz: Quiz; quizChoices: QuizChoice[] };
    }
  | {
      type: 'input';
      data: { input: InputRow };
    }
  | {
      type: 'link';
      data: { link: LinkRow };
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
        case 'QUIZ': {
          const quizRows = await getEmbedQuizzes(embed.id);
          const quizzes = await Promise.all(
            quizRows.map(async (quiz) => {
              const quizChoices = await getQuizChoices(quiz.id);
              return { quiz, quizChoices };
            }),
          );
          return quizzes.map(({ quiz, quizChoices }) => ({
            type: 'quiz' as const,
            data: { quiz, quizChoices },
          }));
        }
        case 'INPUT': {
          const inputRows = await getEmbedInputs(embed.id);
          const inputs = inputRows.map((input) => ({
            type: 'input' as const,
            data: { input },
          }));
          return inputs;
        }
        case 'LINK': {
          const linkRows = await getEmbedLinks(embed.id);
          const links = linkRows.map((link) => ({
            type: 'link' as const,
            data: { link },
          }));

          return links;
        }
        default:
          return [];
      }
    }),
  );
  return buttons.flat();
}
