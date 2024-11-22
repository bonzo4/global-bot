import { Client, Message } from 'discord.js';
import { GuildRow } from 'src/lib/types/guilds';
import { MessageCommand } from '.';
import { UserRow } from 'src/lib/types/user';
import { getGameStats } from 'src/lib/data/game/getGameStats';
import insertGameStats from 'src/lib/data/game/insertGameStats';

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

    if (!choice || !bet) {
      shard.broadcastEval(broadcastFlipWarning, {
        context: {
          warning:
            'Please provide a choice and a bet amount like this: !flip heads 100.',
        },
      });
      return;
    }

    if (choice !== 'heads' && choice !== 'tails') {
      shard.broadcastEval(broadcastFlipWarning, {
        context: {
          warning: 'Please provide a valid choice: heads or tails.',
        },
      });
      return;
    }

    if (Number.isNaN(bet)) {
      shard.broadcastEval(broadcastFlipWarning, {
        context: {
          warning: 'Please provide a valid bet amount.',
        },
      });
      return;
    }

    const betAmount = parseInt(bet, 10);

    if (betAmount < 1) {
      shard.broadcastEval(broadcastFlipWarning, {
        context: {
          warning: 'Please provide a bet amount greater than 0.',
        },
      });
      return;
    }
  };
}

export function broadcastFlipWarning(
  client: Client,
  { warning }: { warning: string },
) {
  client.emit('broadcast', { warning });
}
