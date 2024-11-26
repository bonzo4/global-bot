import { Client } from 'discord.js';
import ChannelCache from 'src/lib/utils/channelCache';
import { EventHandler } from '.';
import { getGlobalChannel } from 'src/lib/data/channels/getGlobalChannel';
import { getUser } from 'src/lib/data/users/getUser';
import { SendingUtils } from 'src/lib/utils/sending';
import { Logger } from '@nestjs/common';

export default class GlobalWarningHanlder implements EventHandler {
  eventName = 'globalWarning';

  constructor(
    private readonly client: Client,
    private readonly channelCache: ChannelCache,
  ) {}

  process = async ({
    warning,
    userId,
    sourceChannelId,
  }: {
    warning: string;
    userId: string;
    sourceChannelId: string;
  }): Promise<void> => {
    const sourceChannel = await getGlobalChannel(sourceChannelId);
    if (!sourceChannel) return;

    const userRow = await getUser(userId);
    if (!userRow) return;

    const channelIds = this.channelCache.getGlobalChannelIds();
    await Promise.all(
      channelIds.map(async (channelId) => {
        const sendingUtils = new SendingUtils(this.client, this.channelCache, {
          channelId,
          userRow,
          sourceChannel,
          payload: {
            type: 'warning',
            data: warning,
          },
        });
        await sendingUtils.handleChannel().catch((err) => {
          Logger.error(`Error processing global warning: ${err}`);
        });
      }),
    );
  };
}
