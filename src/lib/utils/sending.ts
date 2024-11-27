import {
  ChannelType,
  Client,
  EmbedBuilder,
  SnowflakeUtil,
  TextChannel,
  WebhookClient,
} from 'discord.js';
import { ChannelRow } from '../types/channels';
import { UserRow } from '../types/user';
import { AiResponseRow, MessageRow } from '../types/messages';
import { EmbedUtils } from './embeds';
import RequiredPermissions from './permissions';
import { deleteGlobalChannel } from '../data/channels/deleteGlobalChannel';
import ChannelCache from './channelCache';
import { getGlobalChannel } from '../data/channels/getGlobalChannel';
import { getGuild } from '../data/guilds/getGuild';
import { getGuildChannelAccess } from '../data/channels/getGuildChannelAccess';
import { GuildRow } from '../types/guilds';
import { FlipRow, StealRow } from '../types/game';
import { Logger } from '@nestjs/common';
import { insertError } from '../data/errors/insertError';

type DataOptions = {
  channelId: string;
  userRow: UserRow;
  sourceChannel: ChannelRow;
  payload:
    | { type: 'message'; data: { message: MessageRow; tag: string } }
    | { type: 'aiResponse'; data: AiResponseRow }
    | { type: 'gmMessage'; data: { claimedPoints: boolean } }
    | { type: 'flip'; data: FlipRow }
    | { type: 'steal'; data: { steal: StealRow; target: UserRow } }
    | { type: 'warning'; data: string };
};

export class SendingUtils {
  constructor(
    private readonly client: Client,
    private readonly channelCache: ChannelCache,
    private readonly dataOptions: DataOptions,
  ) {}

  public async handleChannel(): Promise<void> {
    const { channelId, userRow, sourceChannel, payload } = this.dataOptions;
    const channelData = await getGlobalChannel(channelId);
    const channel = await this.client.channels.fetch(channelId);

    if (!channelData || !channel || channel.type !== ChannelType.GuildText) {
      await this.cleanupChannel(channelId);
      return;
    }

    const guildData = await getGuild(channelData.guild_id);
    if (!guildData) return;

    if (sourceChannel.channel_access !== channelData.channel_access) {
      return;
    }

    const guildChannelAccess = await getGuildChannelAccess(guildData.id);
    const hasGuildAccess = guildChannelAccess.some(
      (access) =>
        access.channel_access === channelData.channel_access ||
        access.channel_access === 'general',
    );
    if (!hasGuildAccess) {
      await this.sendWarningMessage(
        channelData.webhook_url,
        `This Channel has lost access to ${channelData.channel_access}.`,
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
    try {
      if (payload.type === 'message') {
        await this.sendGlobalMessage(
          channelData.webhook_url,
          payload.data.message,
          userRow,
          payload.data.tag,
        );
      } else if (payload.type === 'gmMessage') {
        await this.sendGMMessage(
          channelData.webhook_url,
          userRow,
          guildData,
          payload.data.claimedPoints,
        );
      } else if (payload.type === 'aiResponse') {
        await this.sendAiMessage(channelData.webhook_url, payload.data);
      } else if (payload.type === 'flip') {
        await this.sendFlipMessage(
          channelData.webhook_url,
          payload.data,
          userRow,
        );
      } else if (payload.type === 'warning') {
        await this.sendWarning(channelData.webhook_url, payload.data);
      } else if (payload.type === 'steal') {
        await this.sendStealMessage(
          channelData.webhook_url,
          payload.data.steal,
          userRow,
          payload.data.target,
        );
      } else {
        throw new Error('Invalid payload type');
      }
    } catch (err) {
      await insertError({
        error: err.message,
        guild_id: guildData.id,
        user_id: userRow.id,
      });
      throw err;
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
    if (lastMessage && lastMessage.author.username === 'NTWRK Global🌐') {
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
      username: 'NTWRK Global🌐',
      avatarURL:
        'https://fendqrkqasmfswadknjj.supabase.co/storage/v1/object/public/pfps/GlobalDiscordLogo.png',
      options: {
        enforceNonce: true,
        nonce,
      },
    });
  }

  private async sendGlobalMessage(
    webhookUrl: string,
    messageData: MessageRow,
    userRow: UserRow,
    guildTag: string,
  ): Promise<void> {
    const globalWebhook = new WebhookClient({ url: webhookUrl });

    const name = userRow.display_name ? userRow.display_name : userRow.username;
    const icon = userRow.is_admin
      ? ' 🌎'
      : userRow.is_mod
        ? ' 🛡'
        : userRow.is_verified
          ? ' ⭐️'
          : '';
    const username = `[${guildTag.toUpperCase()}]` + name + icon;
    const nonce = SnowflakeUtil.generate().toString();

    await globalWebhook.send({
      content: messageData.content,
      username,
      avatarURL:
        userRow.avatar_url ||
        'https://fendqrkqasmfswadknjj.supabase.co/storage/v1/object/public/pfps/GlobalDiscordLogo.png',
      options: {
        enforceNonce: true,
        nonce,
      },
    });
  }

  private async sendAiMessage(webhookUrl: string, responseRow: AiResponseRow) {
    const globalWebhook = new WebhookClient({ url: webhookUrl });

    const nonce = SnowflakeUtil.generate().toString();

    await globalWebhook.send({
      content: responseRow.response,
      username: 'Global AI Helper🌐',
      avatarURL:
        'https://fendqrkqasmfswadknjj.supabase.co/storage/v1/object/public/pfps/GlobalDiscordLogo.png',
      options: {
        enforceNonce: true,
        nonce,
      },
    });
  }

  private async sendGMMessage(
    webhookUrl: string,
    userRow: UserRow,
    guildRow: GuildRow,
    claimedPoints: boolean,
  ) {
    const globalWebhook = new WebhookClient({ url: webhookUrl });

    const nonce = SnowflakeUtil.generate().toString();

    await globalWebhook.send({
      embeds: [EmbedUtils.GmMessage(guildRow, userRow, claimedPoints)],
      username: 'NTWRK Global🌐',
      avatarURL:
        'https://fendqrkqasmfswadknjj.supabase.co/storage/v1/object/public/pfps/GlobalDiscordLogo.png',
      options: {
        enforceNonce: true,
        nonce,
      },
    });
  }

  private async sendFlipMessage(
    webhook_url: string,
    flip: FlipRow,
    user: UserRow,
  ) {
    const globalWebhook = new WebhookClient({ url: webhook_url });

    const nonce = SnowflakeUtil.generate().toString();

    const message = await globalWebhook.send({
      embeds: [EmbedUtils.FlipMessage(flip, user)],
      username: 'NTWRK Global🌐',
      avatarURL:
        'https://fendqrkqasmfswadknjj.supabase.co/storage/v1/object/public/pfps/GlobalDiscordLogo.png',
      options: {
        enforceNonce: true,
        nonce,
      },
    });

    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 5000);
    });

    await globalWebhook.editMessage(message.id, {
      embeds: [EmbedUtils.FlipResult(flip, user)],
    });
  }

  private async sendStealMessage(
    webhook_url: string,
    steal: StealRow,
    user: UserRow,
    target: UserRow,
  ) {
    const globalWebhook = new WebhookClient({ url: webhook_url });

    const nonce = SnowflakeUtil.generate().toString();

    const message = await globalWebhook.send({
      embeds: [EmbedUtils.StealMessage(steal, user, target)],
      username: 'NTWRK Global🌐',
      avatarURL:
        'https://fendqrkqasmfswadknjj.supabase.co/storage/v1/object/public/pfps/GlobalDiscordLogo.png',
      options: {
        enforceNonce: true,
        nonce,
      },
    });

    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 5000);
    });

    await globalWebhook.editMessage(message.id, {
      embeds: [EmbedUtils.StealResult(steal, user, target)],
    });
  }

  private async sendWarning(webhook_url: string, warning: string) {
    const globalWebhook = new WebhookClient({ url: webhook_url });

    const nonce = SnowflakeUtil.generate().toString();

    await globalWebhook.send({
      embeds: [EmbedUtils.Warning(warning)],
      username: 'NTWRK Global🌐',
      avatarURL:
        'https://fendqrkqasmfswadknjj.supabase.co/storage/v1/object/public/pfps/GlobalDiscordLogo.png',
      options: {
        enforceNonce: true,
        nonce,
      },
    });
  }
}
