import { Client, Message } from 'discord.js';
import { GuildRow } from 'src/lib/types/guilds';
import { MessageCommand } from '.';
import { UserRow } from 'src/lib/types/user';
import { getGameStats } from 'src/lib/data/game/getGameStats';
import insertGameStats from 'src/lib/data/game/insertGameStats';
import { GameStatsRow } from 'src/lib/types/game';
import { insertGameFlip } from 'src/lib/data/game/insertGameFlip';
import { updateGameStats } from 'src/lib/data/game/updateGameStats';
import { broadcastWarning } from 'src/lib/utils/broadcast';

export default class FlipMessageCommand implements MessageCommand {
  name = '!flip';

  process = async (
    message: Message<true>,
    guildRow: GuildRow,
    userRow: UserRow,
  ): Promise<void> => {
    const shard = message.client.shard;
    if (!shard) return;

    let gameStats = await getGameStats(userRow.id);

    if (!gameStats) {
      gameStats = await insertGameStats({ user_id: userRow.id });
    }

    const [, choice, bet] = message.content.split(' ');

    const isValidWarning = this.checkCommand(message, gameStats);

    if (isValidWarning) {
      await shard.broadcastEval(broadcastWarning, {
        context: {
          warning: isValidWarning,
          userId: userRow.id,
          sourceChannelId: message.channel.id,
        },
      });
      return;
    }

    const choiceText = choice as 'heads' | 'tails';
    const betAmount = parseInt(bet, 10);

    const flipResult = Math.random() < 0.5;
    const actualResult = flipResult ? 'heads' : 'tails';

    const win = choiceText === actualResult;

    const points = win ? betAmount : -betAmount;

    const flip = await insertGameFlip({
      choice: choiceText,
      points: points,
      user_id: userRow.id,
      is_successful: flipResult,
      guild_id: guildRow.id,
    });

    await updateGameStats(userRow.id, {
      total_points: gameStats.total_points + points,
    });

    await shard.broadcastEval(broadcastFlip, {
      context: {
        flipId: flip.id,
        sourceChannelId: message.channel.id,
      },
    });
  };

  private checkCommand(
    message: Message<true>,
    gameStats: GameStatsRow,
  ): string | null {
    const [, choice, bet] = message.content.split(' ');

    if (!choice || !bet) {
      return 'Please provide a choice and a bet amount like this: !flip heads 100.';
    }

    if (choice !== 'heads' && choice !== 'tails') {
      return 'Please provide a valid choice: heads or tails.';
    }

    if (Number.isNaN(bet)) {
      return 'Please provide a valid bet amount.';
    }

    const betAmount = parseInt(bet, 10);

    if (betAmount < 1) {
      return 'Please provide a bet amount greater than 0.';
    }

    if (betAmount > 1000) {
      return 'Please provide a bet amount less than 1000.';
    }

    if (betAmount > gameStats.total_points) {
      return 'Please provide a bet amount less or equal than your total points.';
    }

    return null;
  }
}

export function broadcastFlip(
  client: Client,
  { flipId, sourceChannelId }: { flipId: number; sourceChannelId: string },
) {
  client.emit('flipMessage', { flipId, sourceChannelId });
}
