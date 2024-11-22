import { Client } from 'discord.js';
import { EventHandler } from '.';
import ChannelCache from 'src/lib/utils/channelCache';
import { getGlobalChannel } from 'src/lib/data/channels/getGlobalChannel';
import { getAiResponse } from 'src/lib/data/aiResponses/getAiResponse';
import { SendingUtils } from 'src/lib/utils/sending';
import { getUser } from 'src/lib/data/users/getUser';

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
    responseId: string;
    sourceChannelId: string;
  }): Promise<void> => {
    const sourceChannel = await getGlobalChannel(sourceChannelId);
    if (!sourceChannel) return;

    const responseRow = await getAiResponse(responseId);
    if (!responseRow) return;

    const userRow = await getUser(responseRow.discord_user_id);
    if (!userRow) return;

    const channelIds = this.channelCache.getGlobalChannelIds();
    for (const channelId of channelIds) {
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
        console.error(`Error processing global message: ${err.message}`);
      });
    }
  };
}
