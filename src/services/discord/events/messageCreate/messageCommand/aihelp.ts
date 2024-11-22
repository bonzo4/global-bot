import { Message } from 'discord.js';
import { MessageCommand } from '.';
import { GuildRow } from 'src/lib/types/guilds';
import { UserRow } from 'src/lib/types/user';
import { getGameStats } from 'src/lib/data/game/getGameStats';
import insertGameStats from 'src/lib/data/game/insertGameStats';

export default class AiHelpMessageCommand implements MessageCommand {
  name = '!aihelp';

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
  };
}
