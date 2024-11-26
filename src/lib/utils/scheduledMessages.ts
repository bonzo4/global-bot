import {
  ActionRowBuilder,
  APIEmbed,
  ButtonBuilder,
  ChannelType,
  Client,
  SnowflakeUtil,
  TextChannel,
  WebhookClient,
} from 'discord.js';
import ChannelCache from './channelCache';
import { HookMessage, MessageAccess } from '../types/messages';
import { EmbedRow } from '../types/embed';
import { EmbedButton } from '../data/embed/getEmbedInteractions';
import { getGlobalChannel } from '../data/channels/getGlobalChannel';
import { EmbedUtils } from './embeds';
import { deleteGlobalChannel } from '../data/channels/deleteGlobalChannel';
import RequiredPermissions from './permissions';
import { getGuild } from '../data/guilds/getGuild';
import { getGuildChannelAccess } from '../data/channels/getGuildChannelAccess';
import { pollButtons } from 'src/services/discord/events/interactions/buttons/poll/components';
import { Json } from '../supabase/types';
import { quizButtons } from 'src/services/discord/events/interactions/buttons/quizzes/components';
import { inputButton } from 'src/services/discord/events/interactions/buttons/input/components';
import { linkButton } from 'src/services/discord/events/interactions/buttons/link/components';

type DataOptions = {
  channelId: string;
  payload: {
    type: 'hookMessage';
    data: {
      message: HookMessage;
      embeds: { embed: EmbedRow[]; buttons: EmbedButton[] }[];
      access: MessageAccess[];
    };
  };
};

export class ScheduledMessageUtils {
  constructor(
    private readonly client: Client,
    private readonly channelCache: ChannelCache,
    private readonly dataOptions: DataOptions,
  ) {}

  public async handleChannel(): Promise<void> {
    const { channelId, payload } = this.dataOptions;
    const channelData = await getGlobalChannel(channelId);
    const channel = await this.client.channels.fetch(channelId);

    if (!channelData || !channel || channel.type !== ChannelType.GuildText) {
      await this.cleanupChannel(channelId);
      return;
    }

    const guildData = await getGuild(channelData.guild_id);
    if (!guildData) return;

    const hasAccess = payload.data.access
      .map((a) => a.channel_access)
      .includes(channelData.channel_access);

    if (!hasAccess) return;

    // this isn't right
    const guildChannelAccess = await getGuildChannelAccess(guildData.id);
    const hasGuildAccess = guildChannelAccess.some(
      (access) => access.channel_access === channelData.channel_access,
    );
    if (!hasGuildAccess) {
      await this.sendWarningMessage(
        channelData.webhook_url,
        `This channel has lost access to ${channelData.channel_access}.`,
        channel,
      );
      return;
    }

    if (!this.hasRequiredPermissions(channel)) {
      await this.sendWarningMessage(
        channelData.webhook_url,
        `I don't have the required permissions to send messages in this channel.`,
        channel,
      );
      return;
    }

    // send message
    if (payload.type === 'hookMessage') {
      for (const embed of payload.data.embeds) {
        await this.sendHookMessage(channelData.webhook_url, embed);
      }
    } else {
      return;
    }
  }

  private async cleanupChannel(channelId: string): Promise<void> {
    this.channelCache.removeGlobalChannel(channelId);
    await deleteGlobalChannel(channelId);
  }

  private hasRequiredPermissions(channel: TextChannel): boolean {
    if (!channel.guild.members.me) return false;
    const permissions = channel.permissionsFor(channel.guild.members.me);
    const missingPermissions =
      permissions?.missing(RequiredPermissions.minimumPermissions) || [];
    return missingPermissions.length === 0;
  }

  private async sendWarningMessage(
    webhookUrl: string,
    warning: string,
    channel: TextChannel,
  ): Promise<void> {
    const globalWebhook = new WebhookClient({ url: webhookUrl });

    const nonce = SnowflakeUtil.generate().toString();

    const lastMessage = channel.messages.cache.last();
    if (lastMessage && lastMessage.author.username === 'Global Message') {
      const sameContent =
        JSON.stringify(lastMessage.embeds[0].toJSON()) ===
        JSON.stringify(EmbedUtils.Warning(warning).toJSON());
      if (lastMessage.deletable && !sameContent) {
        await lastMessage.delete();
      } else {
        return;
      }
    }

    await globalWebhook.send({
      embeds: [EmbedUtils.Warning(warning)],
      username: 'Global Message',
      avatarURL:
        'https://fendqrkqasmfswadknjj.supabase.co/storage/v1/object/public/pfps/GlobalDiscordLogo.png',
      options: {
        enforceNonce: true,
        nonce,
      },
    });
  }

  private async getButtonRows(
    buttons: EmbedButton[],
  ): Promise<ActionRowBuilder<ButtonBuilder>[]> {
    const buttonRows = buttons.map((button) => {
      switch (button.type) {
        case 'poll': {
          return pollButtons(
            button.data.pollChoices,
            button.data.poll.is_random,
          );
        }
        case 'quiz': {
          return quizButtons(
            button.data.quizChoices,
            button.data.quiz.is_random,
          );
        }
        case 'input': {
          return inputButton(button.data.input);
        }
        case 'link': {
          return linkButton(button.data.link);
        }
        default:
          return [];
      }
    });

    return buttonRows.flat();
  }

  private async sendHookMessage(
    webhookUrl: string,
    embeds: { embed: EmbedRow[]; buttons: EmbedButton[] },
  ): Promise<void> {
    const globalWebhook = new WebhookClient({ url: webhookUrl });

    const nonce = SnowflakeUtil.generate().toString();

    const buttons = await this.getButtonRows(embeds.buttons);

    const embedContent = embeds.embed.map((embed) =>
      this.removeId(embed.content),
    ) as APIEmbed[];

    await globalWebhook.send({
      embeds: embedContent,
      components: buttons,
      username: 'NTWRK Global🌐',
      avatarURL:
        'https://fendqrkqasmfswadknjj.supabase.co/storage/v1/object/public/pfps/GlobalDiscordLogo.png',
      options: {
        enforceNonce: true,
        nonce,
      },
    });
  }

  private removeId(content: Json): any {
    if (!content) return content;
    let parsedContent = JSON.parse(content.toString());
    if (parsedContent.id) delete parsedContent.id;
    return parsedContent;
  }
}
