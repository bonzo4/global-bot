import { ChannelType, Client, Collection, Message } from 'discord.js';
import { EventHandler } from '.';
import ChannelCache from 'src/lib/utils/channelCache';
import { getUser } from 'src/lib/data/users/getUser';
import { updateMessage } from 'src/lib/data/messages/updateMessage';
import { Logger } from '@nestjs/common';

export default class GlobalBanHandler implements EventHandler {
  eventName = 'globalBan';

  constructor(
    private readonly client: Client,
    private readonly channelCache: ChannelCache,
  ) {}

  process = async ({ userId }: { userId: string }): Promise<void> => {
    const channelIds = this.channelCache.getGlobalChannelIds();
    for (const channelId of channelIds) {
      this.handleChannel(channelId, userId).catch((err) => {
        Logger.error(`Error processing global ban: ${err.message}`);
      });
    }
  };

  private async handleChannel(
    channelId: string,
    userId: string,
  ): Promise<void> {
    const channel = await this.client.channels.fetch(channelId);
    if (!channel) return;
    if (channel.type !== ChannelType.GuildText) return;

    const user = await getUser(userId);
    if (!user) return;

    const messages = await channel.messages.fetch();
    const sentMessages = messages.filter(
      (message) => message.author.id === userId,
    );
    await this.deleteMessages(sentMessages, true);

    const userMessages = messages.filter(
      (message) =>
        message.author.displayName.includes(user.username) ||
        message.author.displayName.includes(user.display_name || user.username),
    );
    await this.deleteMessages(userMessages, false);
  }

  private async deleteMessages(
    messages: Collection<string, Message>,
    source: boolean,
  ): Promise<void> {
    for (const message of messages.values()) {
      if (source) {
        await updateMessage(message.id, { deleted: true });
      }
      await message.delete();
    }
  }
}
