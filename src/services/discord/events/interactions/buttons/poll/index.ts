import { ButtonInteraction } from 'discord.js';
import { ButtonHandler } from '..';
import { getPoll } from 'src/lib/data/poll/getPoll';
import { getEmbed } from 'src/lib/data/embed/getEmbed';
import { getPollInteractions } from 'src/lib/data/poll/getPollInteraction';
import { insertPollInteraction } from 'src/lib/data/poll/insertPollInteraction';
import { getPollChoices } from 'src/lib/data/poll/getPollChoices';
import { PollChoice } from 'src/lib/types/poll';
import { EmbedUtils } from 'src/lib/utils/embeds';
import { getPollChoice } from 'src/lib/data/poll/getPollChoice';
import { getGameStats } from 'src/lib/data/game/getGameStats';
import { fetchUser } from 'src/lib/data/users/fetchUser';
import { insertGameStats } from 'src/lib/data/game/insertGameStats';

export default class PollButtonHandler implements ButtonHandler {
  customId = 'poll';
  options = {
    deferReply: true,
  };

  process = async (interaction: ButtonInteraction<'cached'>): Promise<void> => {
    await fetchUser(interaction.user);
    const [, pollId, choiceId] = interaction.customId.split('_');
    const poll = await getPoll(parseInt(pollId, 10));

    if (!poll) {
      await interaction.followUp({
        embeds: [EmbedUtils.Warning('Poll not found')],
        ephemeral: true,
      });
      return;
    }
    const embed = await getEmbed(poll.embed_id);
    if (!embed) {
      await interaction.followUp({
        embeds: [EmbedUtils.Warning('Poll not found')],
        ephemeral: true,
      });
      return;
    }

    const pollChoices = await getPollChoices(poll.id);
    const pollInteractions = await getPollInteractions(
      poll.id,
      interaction.user.id,
    );

    const pollInteractionChoice = pollInteractions
      .filter((interaction) => interaction.poll_choice_id !== null)
      .at(0);

    if (choiceId === 'results') {
      if (!pollInteractionChoice) {
        const embeds = interaction.message.embeds;
        const components = interaction.message.components;
        await insertPollInteraction({
          user_id: interaction.user.id,
          message_id: embed.message_id,
          poll_id: poll.id,
          guild_id: interaction.guild.id,
        });

        await interaction.followUp({
          content: '⚠┃You have not voted yet.',
          embeds: embeds,
          components: components,
          ephemeral: true,
        });
        return;
      }

      const resultsMessage = `📊┃**Results**\n\n❓┃*Question*: ${
        poll.question
      }\n\n${this.formateResults(
        pollChoices,
        pollChoices.find(
          (choice) => choice.id === pollInteractionChoice.poll_choice_id,
        ),
      )}`;
      await insertPollInteraction({
        user_id: interaction.user.id,
        message_id: embed.message_id,
        poll_id: poll.id,
        guild_id: interaction.guild.id,
      });
      await interaction.followUp({
        embeds: [EmbedUtils.Info(resultsMessage)],
        ephemeral: true,
      });
      return;
    }

    if (pollInteractionChoice) {
      const resultsMessage = `You already voted.\n\n📊┃**Results**\n\n❓┃*Question*: ${
        poll.question
      }\n\n${this.formateResults(
        pollChoices,
        pollChoices.find(
          (choice) => choice.id === pollInteractionChoice.poll_choice_id,
        ),
      )}`;

      await interaction.followUp({
        embeds: [EmbedUtils.Success(resultsMessage)],
        ephemeral: true,
      });
      return;
    }

    const choice = await getPollChoice(parseInt(choiceId, 10));

    console.log(choice);

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

    const pollInteraction = await insertPollInteraction({
      user_id: interaction.user.id,
      message_id: embed.message_id,
      poll_id: parseInt(pollId, 10),
      poll_choice_id: parseInt(choiceId, 10),
      guild_id: interaction.guild.id,
    });

    const resultsMessage = `Thank you for voting.\n\n📊┃**Results**\n\n❓┃*Question*: ${
      poll.question
    }\n\n${this.formateResults(
      pollChoices,
      pollChoices.find((choice) => choice.id === parseInt(choiceId, 10)),
      true,
    )}\n\n+100`;

    await interaction.followUp({
      embeds: [EmbedUtils.Success(resultsMessage)],
      ephemeral: true,
    });
  };

  private formateResults(
    results: PollChoice[],
    vote?: PollChoice,
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
