import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { QuizChoice } from 'src/lib/types/quiz';

function* quizStyler(): Generator<ButtonStyle> {
  while (true) {
    yield ButtonStyle.Primary;
    yield ButtonStyle.Success;
    yield ButtonStyle.Danger;
  }
}

function createRow(
  choices: QuizChoice[],
  quizStyle: Generator<ButtonStyle>,
): ActionRowBuilder<ButtonBuilder> {
  const row = new ActionRowBuilder<ButtonBuilder>();
  choices.forEach((choice) => {
    const button = new ButtonBuilder()
      .setCustomId(`quiz_${choices[0].quiz_id}_${choice.id}`)
      .setLabel(choice.label)
      .setStyle(quizStyle.next().value);

    if (choice.emoji) button.setEmoji(choice.emoji);
    row.addComponents(button);
  });
  return row;
}

export function quizButtons(
  choices: QuizChoice[],
  randomized: boolean,
): ActionRowBuilder<ButtonBuilder>[] {
  if (choices.length < 0) return [];

  const quizStyle = quizStyler();
  const randomChoices = randomized
    ? choices.sort(() => Math.random() - 0.5)
    : choices;

  const choiceRows: QuizChoice[][] = [];

  for (let i = 0; i < randomChoices.length; i += 5) {
    choiceRows.push(randomChoices.slice(i, i + 5));
  }

  const rows: ActionRowBuilder<ButtonBuilder>[] = [];
  choiceRows.forEach((choices) => {
    rows.push(createRow(choices, quizStyle));
  });

  if (randomChoices.length % 5 === 0) {
    rows.push(
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId(`quiz_${choices[0].quiz_id}_results`)
          .setLabel('Results')
          .setStyle(ButtonStyle.Secondary),
      ),
    );
  } else {
    rows[rows.length - 1].addComponents(
      new ButtonBuilder()
        .setCustomId(`quiz_${choices[0].quiz_id}_results`)
        .setLabel('Results')
        .setStyle(ButtonStyle.Secondary),
    );
  }

  return rows;
}
