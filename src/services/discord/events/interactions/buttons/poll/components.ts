import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { PollChoice } from 'src/lib/types/poll';

function* pollStyler(): Generator<ButtonStyle> {
  while (true) {
    yield ButtonStyle.Primary;
    yield ButtonStyle.Success;
    yield ButtonStyle.Danger;
  }
}

function createRow(
  choices: PollChoice[],
  pollStyle: Generator<ButtonStyle>,
): ActionRowBuilder<ButtonBuilder> {
  const row = new ActionRowBuilder<ButtonBuilder>();
  choices.forEach((choice) => {
    const button = new ButtonBuilder()
      .setCustomId(`poll_${choices[0].poll_id}_${choice.id}`)
      .setLabel(choice.label)
      .setStyle(pollStyle.next().value);

    if (choice.emoji) button.setEmoji(choice.emoji);
    row.addComponents(button);
  });
  return row;
}

export function pollButtons(
  choices: PollChoice[],
  randomized: boolean,
): ActionRowBuilder<ButtonBuilder>[] {
  if (choices.length < 0) return [];

  const pollStyle = pollStyler();
  const randomChoices = randomized
    ? choices.sort(() => Math.random() - 0.5)
    : choices;

  const choiceRows: PollChoice[][] = [];

  for (let i = 0; i < randomChoices.length; i += 5) {
    choiceRows.push(randomChoices.slice(i, i + 5));
  }

  const rows: ActionRowBuilder<ButtonBuilder>[] = [];
  choiceRows.forEach((choices) => {
    rows.push(createRow(choices, pollStyle));
  });

  if (randomChoices.length % 5 === 0) {
    rows.push(
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId(`poll_${choices[0].poll_id}_results`)
          .setLabel('Results')
          .setStyle(ButtonStyle.Secondary),
      ),
    );
  } else {
    rows[rows.length - 1].addComponents(
      new ButtonBuilder()
        .setCustomId(`poll_${choices[0].poll_id}_results`)
        .setLabel('Results')
        .setStyle(ButtonStyle.Secondary),
    );
  }

  return rows;
}
