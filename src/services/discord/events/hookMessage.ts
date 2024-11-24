import { Client } from 'discord.js';
import { EventHandler } from '.';
import ChannelCache from 'src/lib/utils/channelCache';
import { getHookMessage } from 'src/lib/data/messages/getHookMessage';
import { getEmbed } from 'src/lib/data/embed/getEmbed';
import { getEmbedsByMessageId } from 'src/lib/data/embed/getEmbedsByMessageId';
import { getEmbedButtons } from 'src/lib/data/embed/getEmbedInteractions';
import { getMessageAccess } from 'src/lib/data/messages/getMessageAccess';

export default class HookMessageHandler implements EventHandler {
  eventName = 'hookMessage';

  constructor(
    private readonly client: Client,
    private readonly channelCache: ChannelCache,
  ) {}

  process = async ({ hookId }: { hookId: number }): Promise<void> => {
    const hookMessage = await getHookMessage(hookId);
    if (!hookMessage) return;

    const embeds = await getEmbedsByMessageId(hookMessage.id);
    if (!embeds.length) return;

    const buttons = await Promise.all(
      embeds.map((embed) => getEmbedButtons(embed)),
    );

    const access = await getMessageAccess(hookMessage.id);

    const channelIds = this.channelCache.getGlobalChannelIds();
  };
}
