import { Client, Message, SnowflakeUtil } from 'discord.js';
import { MessageCommand } from '.';
import { UserRow } from 'src/lib/types/user';
import { GuildRow } from 'src/lib/types/guilds';
import { getGameStats } from 'src/lib/data/game/getGameStats';
import { updateGameStats } from 'src/lib/data/game/updateGameStats';
import { Jimp } from 'jimp';
import { supabase } from 'src/lib/supabase';
import { promises as fs } from 'node:fs';
import { updateGuild } from 'src/lib/data/guilds/updateGuild';
import { insertGameStats } from 'src/lib/data/game/insertGameStats';

export default class GmMessageCommand implements MessageCommand {
  name = '!gm';

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

    let claimedPoints = false;
    if (!gameStats.has_claimed) {
      gameStats = await updateGameStats(userRow.id, {
        has_claimed: true,
        total_points: gameStats.total_points + 100,
      });
      claimedPoints = true;
    }

    const guildIconUrl = message.guild.iconURL({ extension: 'png' });

    if (
      !guildIconUrl ||
      (guildIconUrl === guildRow.icon_url && guildRow.gm_url)
    ) {
      await shard.broadcastEval(broadcastGM, {
        context: {
          userId: userRow.id,
          sourceChannelId: message.channel.id,
          claimedPoints,
        },
      });
      return;
    }

    const gmOverlay = (
      await Jimp.read(
        'https://fendqrkqasmfswadknjj.supabase.co/storage/v1/object/public/Bot%20Images/GM_overlay_no_logo.png',
      )
    ).resize({ w: 512, h: 512 });

    const guildIcon = (await Jimp.read(guildIconUrl)).resize({
      w: 512,
      h: 512,
    });

    guildIcon.composite(gmOverlay, 0, 0);

    await guildIcon.write('./gm_image.png');
    const file = await fs.readFile('./gm_image.png');

    const nonce = SnowflakeUtil.generate().toString();

    await supabase.storage
      .from('GM Images')
      .upload(`gm_${message.guildId}_${nonce}.png`, file);

    const {
      data: { publicUrl },
    } = supabase.storage
      .from('GM Images')
      .getPublicUrl(`gm_${message.guildId}_${nonce}.png`);

    guildRow = await updateGuild(message.guildId, {
      gm_url: publicUrl,
      icon_url: guildIconUrl,
    });

    await shard.broadcastEval(broadcastGM, {
      context: {
        userId: userRow.id,
        sourceChannelId: message.channel.id,
        claimedPoints,
      },
    });
  };
}

export function broadcastGM(
  client: Client,
  {
    userId,
    sourceChannelId,
  }: { userId: string; sourceChannelId: string; claimedPoints: boolean },
) {
  client.emit('gmMessage', { userId, sourceChannelId, claimedPoints: true });
}
