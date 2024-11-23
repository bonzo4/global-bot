import { Client } from 'discord.js';
import ChannelCache from 'src/lib/utils/channelCache';
import { EventHandler } from '.';
import { getGlobalChannel } from 'src/lib/data/channels/getGlobalChannel';
import { getGameSteal } from 'src/lib/data/game/getGameSteal';
import { getUser } from 'src/lib/data/users/getUser';
import { SendingUtils } from 'src/lib/utils/sending';
import { Logger } from '@nestjs/common';

export default class StealMessageHandler implements EventHandler {
  eventName = 'stealMessage';

  constructor(
    private readonly client: Client,
    private readonly channelCache: ChannelCache,
  ) {}

  process = async ({
    stealId,
    sourceChannelId,
  }: {
    stealId: number;
    sourceChannelId: string;
  }) => {
    const sourceChannel = await getGlobalChannel(sourceChannelId);
    if (!sourceChannel) return;

    const stealRow = await getGameSteal(stealId);
    if (!stealRow) return;

    const user = await getUser(stealRow.user_id);
    if (!user) return;

    const target = await getUser(stealRow.target_id);
    if (!target) return;

    const channelIds = this.channelCache.getGlobalChannelIds();
    for (const channelId of channelIds) {
      const sendingUtils = new SendingUtils(this.client, this.channelCache, {
        channelId,
        userRow: user,
        sourceChannel,
        payload: {
          type: 'steal',
          data: {
            steal: stealRow,
            target,
          },
        },
      });
      await sendingUtils.handleChannel().catch((err) => {
        Logger.error(`Error processing flip message: ${err.message}`);
      });
    }
  };
}
