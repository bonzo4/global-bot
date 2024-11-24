import { Client, Message } from 'discord.js';
import { getGameStats } from 'src/lib/data/game/getGameStats';
import insertGameStats from 'src/lib/data/game/insertGameStats';
import { GuildRow } from 'src/lib/types/guilds';
import { UserRow } from 'src/lib/types/user';
import { MessageCommand } from '.';
import { GameStatsRow } from 'src/lib/types/game';
import { broadcastWarning } from 'src/lib/utils/broadcast';
import { searchUser } from 'src/lib/data/users/searchUser';
import { insertGameSteal } from 'src/lib/data/game/insertGameSteal';
import { updateGameStats } from 'src/lib/data/game/updateGameStats';

export default class StealMessageCommand implements MessageCommand {
  name = '!steal';

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

    const [, user, amount] = message.content.split(' ');

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

    const userString = user as string;
    const stealAmount = parseInt(amount, 10);

    const targetUser = await searchUser(userString);

    if (!targetUser) {
      await shard.broadcastEval(broadcastWarning, {
        context: {
          warning: 'User not found.',
          userId: userRow.id,
          sourceChannelId: message.channel.id,
        },
      });
      return;
    }

    const targetStats = await getGameStats(targetUser.id);

    if (!targetStats || targetStats.total_points < stealAmount) {
      await shard.broadcastEval(broadcastWarning, {
        context: {
          warning: 'User does not have enough points to steal that amount.',
          userId: userRow.id,
          sourceChannelId: message.channel.id,
        },
      });
      return;
    }

    if (targetStats.has_shield) {
      await shard.broadcastEval(broadcastWarning, {
        context: {
          warning: 'User has a shield and cannot be stolen from.',
          userId: userRow.id,
          sourceChannelId: message.channel.id,
        },
      });
    }

    const flipResult = Math.random() < 0.3;
    const points = flipResult ? stealAmount : -stealAmount;

    const steal = await insertGameSteal({
      user_id: userRow.id,
      points,
      target_id: targetUser.id,
      guild_id: guildRow.id,
      is_successful: flipResult,
    });

    await updateGameStats(userRow.id, {
      total_points: gameStats.total_points + points,
    });

    if (flipResult) {
      await updateGameStats(targetUser.id, {
        total_points: targetStats.total_points - points,
        has_shield: true,
      });
    }

    await shard.broadcastEval(broadcastSteal, {
      context: {
        stealId: steal.id,
        sourceChannelId: message.channel.id,
      },
    });
  };

  private checkCommand(
    message: Message<true>,
    gameStats: GameStatsRow,
  ): string | null {
    const [, user, amount] = message.content.split(' ');

    if (!user || !amount) {
      return 'Please specify a user and an amount to steal like this: !steal user 100.';
    }

    if (Number.isNaN(amount)) {
      return 'Please provide a valid bet amount.';
    }

    const amountNum = parseInt(amount, 10);

    if (amountNum < 1) {
      return 'Please provide a positive bet amount.';
    }

    if (amountNum > 1000) {
      return 'You cannot steal more than 1000 points at a time.';
    }

    if (amountNum > gameStats.total_points) {
      return 'You do not have enough points to steal that amount.';
    }

    return null;
  }
}

export function broadcastSteal(
  client: Client,
  { stealId, sourceChannelId }: { stealId: number; sourceChannelId: string },
) {
  client.emit('stealMessage', { stealId, sourceChannelId });
}
