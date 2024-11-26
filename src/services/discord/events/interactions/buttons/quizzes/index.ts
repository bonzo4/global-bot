import { ButtonInteraction } from 'discord.js';
import { ButtonHandler } from '..';
import { getQuiz } from 'src/lib/data/quiz/getQuiz';
import { getEmbed } from 'src/lib/data/embed/getEmbed';
import { QuizChoice } from 'src/lib/types/quiz';
import { EmbedUtils } from 'src/lib/utils/embeds';
import { getGameStats } from 'src/lib/data/game/getGameStats';
import { fetchUser } from 'src/lib/data/users/fetchUser';
import { getQuizChoices } from 'src/lib/data/quiz/getQuizChoices';
import { getQuizInteractions } from 'src/lib/data/quiz/getPollInteraction';
import { insertQuizInteraction } from 'src/lib/data/quiz/insertQuizInteraction';
import { getQuizChoice } from 'src/lib/data/quiz/getQuizChoice';
import { insertGameStats } from 'src/lib/data/game/insertGameStats';

export default class QuizButtonHandler implements ButtonHandler {
  customId = 'quiz';
  options = {
    deferReply: true,
  };

  process = async (interaction: ButtonInteraction<'cached'>): Promise<void> => {
    await fetchUser(interaction.user);
    const [, quizId, choiceId] = interaction.customId.split('_');
    const quiz = await getQuiz(parseInt(quizId, 10));

    if (!quiz) {
      await interaction.followUp({
        embeds: [EmbedUtils.Warning('Quiz not found')],
        ephemeral: true,
      });
      return;
    }
    const embed = await getEmbed(quiz.embed_id);
    if (!embed) {
      await interaction.followUp({
        embeds: [EmbedUtils.Warning('Quiz not found')],
        ephemeral: true,
      });
      return;
    }

    const quizChoices = await getQuizChoices(quiz.id);
    const quizInteractions = await getQuizInteractions(
      quiz.id,
      interaction.user.id,
    );

    const quizInteractionChoice = quizInteractions
      .filter((interaction) => interaction.quiz_choice_id !== null)
      .at(0);

    if (choiceId === 'results') {
      if (!quizInteractionChoice) {
        const embeds = interaction.message.embeds;
        const components = interaction.message.components;
        await insertQuizInteraction({
          user_id: interaction.user.id,
          message_id: embed.message_id,
          quiz_id: quiz.id,
          guild_id: interaction.guild.id,
        });

        await interaction.followUp({
          content: '⚠┃You have not answered yet.',
          embeds: embeds,
          components: components,
          ephemeral: true,
        });
        return;
      }

      const resultsMessage = `📊┃**Results**\n\n❓┃*Question*: ${
        quiz.question
      }\n\n${this.formateResults(
        quizChoices,
        quizChoices.find(
          (choice) => choice.id === quizInteractionChoice.quiz_choice_id,
        ),
      )}\n\n⭐┃Answer: ${quiz.answer}`;
      await insertQuizInteraction({
        user_id: interaction.user.id,
        message_id: embed.message_id,
        quiz_id: quiz.id,
        guild_id: interaction.guild.id,
      });
      await interaction.followUp({
        embeds: [EmbedUtils.Info(resultsMessage)],
        ephemeral: true,
      });
      return;
    }

    if (quizInteractionChoice) {
      const resultsMessage = `🌐┃You already answered.\n\n📊┃**Results**\n\n❓┃*Question*: ${
        quiz.question
      }\n\n${this.formateResults(
        quizChoices,
        quizChoices.find(
          (choice) => choice.id === quizInteractionChoice.quiz_choice_id,
        ),
      )}\n\n⭐┃Answer: ${quiz.answer}`;

      await interaction.followUp({
        embeds: [EmbedUtils.Info(resultsMessage)],
        ephemeral: true,
      });
      return;
    }

    const choice = await getQuizChoice(parseInt(choiceId, 10));

    if (!choice) {
      await interaction.followUp({
        embeds: [EmbedUtils.Warning('Choice not found')],
        ephemeral: true,
      });
      return;
    }

    let gameStats = await getGameStats(interaction.user.id);

    if (!gameStats) {
      gameStats = await insertGameStats({ user_id: interaction.user.id });
    }

    const quizInteraction = await insertQuizInteraction({
      user_id: interaction.user.id,
      message_id: embed.message_id,
      quiz_id: parseInt(quizId, 10),
      quiz_choice_id: parseInt(choiceId, 10),
      guild_id: interaction.guild.id,
    });

    const resultsMessage = `🌐┃Thank you for voting.\n\n📊┃**Results**\n\n❓┃*Question*: ${
      quiz.question
    }\n\n${this.formateResults(
      quizChoices,
      quizChoices.find((choice) => choice.id === parseInt(choiceId, 10)),
      true,
    )}\n\n⭐┃Answer: ${quiz.answer}\n\n+100`;

    await interaction.followUp({
      embeds: [EmbedUtils.Info(resultsMessage)],
      ephemeral: true,
    });
  };

  private formateResults(
    results: QuizChoice[],
    vote?: QuizChoice,
    justVoted?: boolean,
  ): string {
    const totalVotes = results.reduce(
      (a, b) => a + b.votes,
      0 + (justVoted ? 1 : 0),
    );
    let text = '';
    results.forEach((result, index) => {
      const percentageString =
        `${(vote === result ? result.votes + (justVoted ? 1 : 0) : result.votes / totalVotes) * 100}`.split(
          '.',
        )[0] + '%';
      text +=
        vote === result
          ? `✅┃${result.emoji}┃**${result.label}: ${result.votes + (justVoted ? 1 : 0)} (${percentageString})**\n`
          : `${this.getNumberEmoji(index)}┃${result.emoji}┃${result.label}: ${
              result.votes
            } (${percentageString})\n`;
    });
    return text + `\nTotal votes: ${totalVotes}`;
  }

  private getNumberEmoji(number: number): string {
    switch (number) {
      case 0:
        return '1️⃣';
      case 1:
        return '2️⃣';
      case 2:
        return '3️⃣';
      case 3:
        return '4️⃣';
      case 4:
        return '5️⃣';
    }
    return '';
  }
}
