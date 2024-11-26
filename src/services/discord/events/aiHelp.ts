import { Client } from 'discord.js';
import { EventHandler } from '.';
import ChannelCache from 'src/lib/utils/channelCache';
import { getGlobalChannel } from 'src/lib/data/channels/getGlobalChannel';
import { getAiResponse } from 'src/lib/data/aiResponses/getAiResponse';
import { SendingUtils } from 'src/lib/utils/sending';
import { getUser } from 'src/lib/data/users/getUser';
import { Logger } from '@nestjs/common';

export default class AiHelpHandler implements EventHandler {
  eventName = 'aiHelp';

  constructor(
    private readonly client: Client,
    private readonly channelCache: ChannelCache,
  ) {}

  process = async ({
    responseId,
    sourceChannelId,
  }: {
    responseId: number;
    sourceChannelId: string;
  }): Promise<void> => {
    const sourceChannel = await getGlobalChannel(sourceChannelId);
    if (!sourceChannel) return;

    const responseRow = await getAiResponse(responseId);
    if (!responseRow) return;

    const userRow = await getUser(responseRow.discord_user_id);
    if (!userRow) return;

    const channelIds = this.channelCache.getGlobalChannelIds();
    await Promise.all(
      channelIds.map(async (channelId) => {
        const sendingUtils = new SendingUtils(this.client, this.channelCache, {
          channelId,
          userRow,
          sourceChannel,
          payload: {
            type: 'aiResponse',
            data: responseRow,
          },
        });
        await sendingUtils.handleChannel().catch((err) => {
          Logger.error(`Error processing ai response: ${err.message}`);
        });
      }),
    );
  };
}
