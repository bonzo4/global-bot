import {
  ChannelType,
  Client,
  EmbedBuilder,
  SnowflakeUtil,
  TextChannel,
  WebhookClient,
} from 'discord.js';
import { EventHandler } from '.';
import ChannelCache from 'src/lib/utils/channelCache';
import { getGlobalChannel } from 'src/lib/data/channels/getGlobalChannel';
import { getUser } from 'src/lib/data/users/getUser';
import { getGuild } from 'src/lib/data/guilds/getGuild';
import { EmbedUtils } from 'src/lib/utils/embeds';
import { deleteGlobalChannel } from 'src/lib/data/channels/deleteGlobalChannel';
import { getGuildChannelAccess } from 'src/lib/data/channels/getGuildChannelAccess';
import RequiredPermissions from 'src/lib/utils/permissions';
import { UserRow } from 'src/lib/types/user';
import { ChannelRow } from 'src/lib/types/channels';

export default class GmMessageHandler implements EventHandler {
  eventName = 'gmMessage';

  constructor(
    private readonly client: Client,
    private readonly channelCache: ChannelCache,
  ) {}

  process = async ({
    userId,
    sourceChannelId,
    hasGuildIcon,
  }: {
    userId: string;
    sourceChannelId: string;
    hasGuildIcon: boolean;
  }): Promise<void> => {
    const sourceChannel = await getGlobalChannel(sourceChannelId);
    if (!sourceChannel) return;

    const userRow = await getUser(userId);
    if (!userRow) return;

    const channelIds = this.channelCache.getGlobalChannelIds();
    for (const channelId of channelIds) {
      await this.handleChannel(
        channelId,
        userRow,
        hasGuildIcon,
        sourceChannel,
      ).catch((err) => {
        console.error(`Error processing global message: ${err.message}`);
      });
    }
  };

  private async handleChannel(
    channelId: string,
    userRow: UserRow,
    hasGuildIcon: boolean,
    sourceChannel: ChannelRow,
  ): Promise<void> {
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

    await this.sendGMMessage(
      channelData.webhook_url,
      EmbedUtils.GmMessage(guildData, userRow, hasGuildIcon),
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

  private async sendGMMessage(webhookUrl: string, embed: EmbedBuilder) {
    const globalWebhook = new WebhookClient({ url: webhookUrl });

    const nonce = SnowflakeUtil.generate().toString();

    await globalWebhook.send({
      embeds: [embed],
      username: '🌐Syndicate Global',
      avatarURL:
        'https://fendqrkqasmfswadknjj.supabase.co/storage/v1/object/public/pfps/GlobalDiscordLogo.png',
      options: {
        enforceNonce: true,
        nonce,
      },
    });
  }
}
