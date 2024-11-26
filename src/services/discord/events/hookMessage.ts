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

  process = async ({ messageId }: { messageId: number }): Promise<void> => {
    const hookMessage = await getHookMessage(messageId);
    if (!hookMessage) return;

    const embeds = await getEmbedsByMessageId(hookMessage.id);
    if (!embeds.length) return;

    const embedsWithButtons = await Promise.all(
      embeds.map(async (embed) => {
        const buttons = await getEmbedButtons(embed);
        return { embed, buttons: buttons.sort((a, b) => a.order - b.order) };
      }),
    );

    const result: { embed: EmbedRow[]; buttons: EmbedButton[] }[] = []; // This array will store the final grouped results
    let currentGroup: EmbedRow[] = []; // Correctly typed to store EmbedRow items
    let currentButtons: EmbedButton[] = []; // Correctly initialize an empty button array

    const orderedEmbeds = embedsWithButtons.sort(
      (a, b) => a.embed.order - b.embed.order,
    );

    // Iterate through each embed item in embedsWithButtons
    for (const { embed, buttons } of orderedEmbeds) {
      // Add the current embed to the current group
      currentGroup.push(embed);

      // If the current embed has buttons or the current group has reached 5 embeds, finalize the group
      if (buttons.length > 0 || currentGroup.length === 5) {
        // Set the current buttons to the ones found in this embed (if any)
        currentButtons = buttons;

        // Push the current group to the result list, ensuring all grouped embeds are included
        result.push({
          embed: currentGroup,
          buttons: currentButtons,
        });

        // Reset current group and buttons for the next iteration
        currentGroup = [];
        currentButtons = [];
      }
    }

    // If there's any leftover embeds in the current group, add them to the result
    if (currentGroup.length > 0) {
      result.push({
        embed: currentGroup,
        buttons: currentButtons,
      });
    }

    // The `result` now contains the final grouped embeds with their buttons.

    // Now, `result` contains the final grouped embeds with their buttons

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
              embeds: result,
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
