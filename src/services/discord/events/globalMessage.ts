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
      await this.handleChannel(
        channelId,
        messageData,
        user,
        sourceChannel,
      ).catch((err) => {
        console.error(`Error processing global message: ${err.message}`);
      });
    }
  };

  private async handleChannel(
    channelId: string,
    messageData: MessageRow,
    userData: UserRow,
    sourceChannel: ChannelRow,
  ): Promise<void> {
    const guildData = await getGuild(messageData.guild_id);
    if (!guildData) return;

    const channelData = await getGlobalChannel(channelId);
    const channel = await this.client.channels.fetch(channelId);

    if (!channelData || !channel || channel.type !== ChannelType.GuildText) {
      await this.cleanupChannel(channelId);
      return;
    }

    if (sourceChannel.channel_access !== channelData.channel_access) {
      return;
    }

    const guildChannelAccess = await getGuildChannelAccess(guildData.id);
    const hasGuildAccess = guildChannelAccess.some(
      (access) => access.channel_access === channelData.channel_access,
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

    await this.sendGlobalMessage(
      channelData.webhook_url,
      messageData,
      userData,
      guildData,
    );
  }

  private async cleanupChannel(channelId: string): Promise<void> {
    this.channelCache.removeGlobalChannel(channelId);
    await deleteGlobalChannel(channelId);
  }

  private hasRequiredPermissions(channel: TextChannel): boolean {
    if (!channel.guild.members.me) return false;
    const permissions = channel.permissionsFor(channel.guild.members.me);
    const missingPermissions =
      permissions?.missing(RequiredPermissions.globalPermissions) || [];
    return missingPermissions.length === 0;
  }

  //   private async hasValidWebhook(
  //     channel: TextChannel,
  //     webhookUrl: string,
  //   ): Promise<boolean> {
  //     const webhooks = await channel.fetchWebhooks();
  //     return webhooks.some((webhook) => webhook.url === webhookUrl);
  //   }

  private async sendWarningMessage(
    webhookUrl: string,
    warning: string,
    channel: TextChannel,
  ): Promise<void> {
    const globalWebhook = new WebhookClient({ url: webhookUrl });

    const nonce = SnowflakeUtil.generate().toString();

    const lastMessage = (await channel.messages.fetch({ limit: 1 })).at(0);
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

  private async sendGlobalMessage(
    webhookUrl: string,
    messageData: MessageRow,
    user: UserRow,
    guildData: GuildRow,
  ): Promise<void> {
    const globalWebhook = new WebhookClient({ url: webhookUrl });

    const name = user.display_name ? user.display_name : user.username;
    const tag = guildData.tag ? `[${guildData.tag.toUpperCase()}] ` : '';
    const icon = user.is_admin
      ? ' 🌎'
      : user.is_mod
        ? ' 🛡'
        : user.is_verified
          ? ' ⭐️'
          : '';
    const username = tag + name + icon;
    const nonce = SnowflakeUtil.generate().toString();

    await globalWebhook.send({
      content: messageData.content,
      username,
      avatarURL:
        user.avatar_url ||
        'https://fendqrkqasmfswadknjj.supabase.co/storage/v1/object/public/pfps/GlobalDiscordLogo.png',
      options: {
        enforceNonce: true,
        nonce,
      },
    });
  }
}
