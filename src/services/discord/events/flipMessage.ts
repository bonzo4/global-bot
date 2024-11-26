import { getGameFlip } from 'src/lib/data/game/getGameFlip';
import { EventHandler } from '.';
import { Client } from 'discord.js';
import ChannelCache from 'src/lib/utils/channelCache';
import { getGlobalChannel } from 'src/lib/data/channels/getGlobalChannel';
import { getUser } from 'src/lib/data/users/getUser';
import { SendingUtils } from 'src/lib/utils/sending';
import { Logger } from '@nestjs/common';

export default class FlipMessageHandler implements EventHandler {
  eventName = 'flipMessage';

  constructor(
    private readonly client: Client,
    private readonly channelCache: ChannelCache,
  ) {}

  process = async ({
    flipId,
    sourceChannelId,
  }: {
    flipId: number;
    sourceChannelId: string;
  }): Promise<void> => {
    const sourceChannel = await getGlobalChannel(sourceChannelId);
    if (!sourceChannel) return;

    const flipRow = await getGameFlip(flipId);
    if (!flipRow) return;

    const user = await getUser(flipRow.user_id);
    if (!user) return;

    const channelIds = this.channelCache.getGlobalChannelIds();
    await Promise.all(
      channelIds.map(async (channelId) => {
        const sendingUtils = new SendingUtils(this.client, this.channelCache, {
          channelId,
          userRow: user,
          sourceChannel,
          payload: {
            type: 'flip',
            data: flipRow,
          },
        });
        await sendingUtils.handleChannel().catch((err) => {
          Logger.error(`Error processing flip message: ${err.message}`);
        });
      }),
    );
  };
}
