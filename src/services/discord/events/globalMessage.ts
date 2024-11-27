import { Client } from 'discord.js';
import { EventHandler } from '.';
import ChannelCache from 'src/lib/utils/channelCache';
import { getGlobalChannel } from 'src/lib/data/channels/getGlobalChannel';
import { getMessage } from 'src/lib/data/messages/getMessage';
import { getUser } from 'src/lib/data/users/getUser';
import { SendingUtils } from 'src/lib/utils/sending';
import { Logger } from '@nestjs/common';
import { getGuild } from 'src/lib/data/guilds/getGuild';

export default class GlobalMessageHandler implements EventHandler {
  eventName = 'globalMessage';

  constructor(
    private readonly client: Client,
    private readonly channelCache: ChannelCache,
  ) {}

  process = async ({
    messageId,
    sourceChannelId,
  }: {
    messageId: string;
    sourceChannelId: string;
  }): Promise<void> => {
    const sourceChannel = await getGlobalChannel(sourceChannelId);
    if (!sourceChannel) return;
    const guildRow = await getGuild(sourceChannel.guild_id);
    if (!guildRow) return;
    const tag = guildRow.tag;
    if (!tag) return;

    const messageData = await getMessage(messageId);
    if (!messageData || messageData.deleted) return;

    const user = await getUser(messageData.user_id);
    if (!user) return;

    const channelIds = this.channelCache.getGlobalChannelIds();
    await Promise.all(
      channelIds.map(async (channelId) => {
        if (sourceChannelId === channelId) return;
        const sendingUtils = new SendingUtils(this.client, this.channelCache, {
          channelId,
          userRow: user,
          sourceChannel,
          payload: {
            type: 'message',
            data: { message: messageData, tag },
          },
        });
        await sendingUtils.handleChannel().catch((err) => {
          Logger.error(`Error processing global message: ${err.message}`);
        });
      }),
    );
  };
}
