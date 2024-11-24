import { Client } from 'discord.js';
import { EventHandler } from '.';
import ChannelCache from 'src/lib/utils/channelCache';
import { getHookMessage } from 'src/lib/data/messages/getHookMessage';
import { getEmbed } from 'src/lib/data/embed/getEmbed';
import { getEmbedsByMessageId } from 'src/lib/data/embed/getEmbedsByMessageId';
import {
  EmbedButton,
  getEmbedButtons,
} from 'src/lib/data/embed/getEmbedInteractions';
import { getMessageAccess } from 'src/lib/data/messages/getMessageAccess';
import { ScheduledMessageUtils } from 'src/lib/utils/scheduledMessages';
import { EmbedRow } from 'src/lib/types/embed';
import { Logger } from '@nestjs/common';

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

    const embedWithButtons = await Promise.all(
      embeds.map(async (embed) => {
        const buttons = await getEmbedButtons(embed);
        return { embed, buttons };
      }),
    );

    const embedsWithButtons: { embed: EmbedRow[]; buttons: EmbedButton[] }[] =
      [];
    let currentGroup: EmbedRow[] = [];
    let currentButtons: EmbedButton[] = [];

    for (const { embed, buttons } of embedWithButtons) {
      if (buttons.length > 0 || currentGroup.length === 5) {
        if (currentGroup.length > 0) {
          embedsWithButtons.push({
            embed: currentGroup,
            buttons: currentButtons,
          });
          currentGroup = [];
          currentButtons = [];
        }
      }
      currentGroup.push(embed);
      currentButtons = buttons;
    }

    if (currentGroup.length > 0) {
      embedsWithButtons.push({ embed: currentGroup, buttons: currentButtons });
    }

    const access = await getMessageAccess(hookMessage.id);

    const channelIds = this.channelCache.getGlobalChannelIds();
    for (const channelId of channelIds) {
      const scheduleMessageUtils = new ScheduledMessageUtils(
        this.client,
        this.channelCache,
        {
          channelId: channelId,
          payload: {
            type: 'hookMessage',
            data: {
              message: hookMessage,
              embeds: embedsWithButtons,
              access: access,
            },
          },
        },
      );

      await scheduleMessageUtils.handleChannel().catch((err) => {
        Logger.error(`Error processing hook message: ${err.message}`);
      });
    }
  };
}
