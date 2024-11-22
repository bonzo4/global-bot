import {
  ChannelType,
  Client,
  SnowflakeUtil,
  TextChannel,
  WebhookClient,
} from 'discord.js';
import { EventHandler } from '.';
import ChannelCache from 'src/lib/utils/channelCache';
import { getGlobalChannel } from 'src/lib/data/channels/getGlobalChannel';
import { deleteGlobalChannel } from 'src/lib/data/channels/deleteGlobalChannel';
import RequiredPermissions from 'src/lib/utils/permissions';
import { getMessage } from 'src/lib/data/messages/getMessage';
import { getUser } from 'src/lib/data/users/getUser';
import { getGuild } from 'src/lib/data/guilds/getGuild';
import { MessageRow } from 'src/lib/types/messages';
import { UserRow } from 'src/lib/types/user';
import { ChannelRow } from 'src/lib/types/channels';
import { GuildRow } from 'src/lib/types/guilds';
import { getGuildChannelAccess } from 'src/lib/data/channels/getGuildChannelAccess';
import { EmbedUtils } from 'src/lib/utils/embeds';
import { SendingUtils } from 'src/lib/utils/sending';

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

    const messageData = await getMessage(messageId);
    if (!messageData || messageData.deleted) return;

    const user = await getUser(messageData.user_id);
    if (!user) return;

    const channelIds = this.channelCache.getGlobalChannelIds();
    for (const channelId of channelIds) {
      if (sourceChannelId === channelId) continue;
      const sendingUtils = new SendingUtils(this.client, this.channelCache, {
        channelId,
        userRow: user,
        sourceChannel,
        payload: {
          type: 'message',
          data: messageData,
        },
      });
      await sendingUtils.handleChannel().catch((err) => {
        console.error(`Error processing global message: ${err.message}`);
      });
    }
  };
}
