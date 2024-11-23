import { Client } from 'discord.js';
import { EventHandler } from '.';
import ChannelCache from 'src/lib/utils/channelCache';
import { getGlobalChannel } from 'src/lib/data/channels/getGlobalChannel';
import { getUser } from 'src/lib/data/users/getUser';
import { SendingUtils } from 'src/lib/utils/sending';
import { Logger } from '@nestjs/common';

export default class GmMessageHandler implements EventHandler {
  eventName = 'gmMessage';

  constructor(
    private readonly client: Client,
    private readonly channelCache: ChannelCache,
  ) {}

  process = async ({
    userId,
    sourceChannelId,
  }: {
    userId: string;
    sourceChannelId: string;
    hasGuildIcon: boolean;
  }): Promise<void> => {
    const sourceChannel = await getGlobalChannel(sourceChannelId);
    if (!sourceChannel) return;

    const userRow = await getUser(userId);
    if (!userRow) return;

    const channelIds = this.channelCache.getGlobalChannelIds();
    for (const channelId of channelIds) {
      const sendingUtils = new SendingUtils(this.client, this.channelCache, {
        channelId,
        userRow,
        sourceChannel,
        payload: {
          type: 'gmMessage',
          data: null,
        },
      });
      await sendingUtils.handleChannel().catch((err) => {
        Logger.error(`Error processing gm message: ${err.message}`);
      });
    }
  };
}
