import { ChannelType, Client } from 'discord.js';
import ChannelCache from 'src/lib/utils/channelCache';
import { EventHandler } from '.';

export default class ChangeTopicHandler implements EventHandler {
  eventName = 'changeTopic';

  constructor(
    private readonly client: Client,
    private readonly channelCache: ChannelCache,
  ) {}

  process = async ({ topic }: { topic: string }): Promise<void> => {
    const channelIds = this.channelCache.getGlobalChannelIds();
    for (const channelId of channelIds) {
      this.handleChannel(channelId, topic).catch((err) => {
        console.error(`Error processing change topic: ${err.message}`);
      });
    }
  };

  private async handleChannel(channelId: string, topic: string): Promise<void> {
    const channel = await this.client.channels.fetch(channelId);
    if (!channel) return;
    if (channel.type !== ChannelType.GuildText) return;
    await channel.setTopic(topic);
  }
}
