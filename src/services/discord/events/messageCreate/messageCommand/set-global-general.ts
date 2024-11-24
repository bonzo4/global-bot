import {
  channelMention,
  Message,
  SnowflakeUtil,
  TextChannel,
  WebhookClient,
} from 'discord.js';
import { getGuildChannels } from 'src/lib/data/channels/getGuildChannels';
import { getGuild } from 'src/lib/data/guilds/getGuild';
import { insertGuild } from 'src/lib/data/guilds/insertGuild';
import { EmbedUtils } from 'src/lib/utils/embeds';
import { MessageCommand } from '.';
import RequiredPermissions from 'src/lib/utils/permissions';
import { createGlobalWebhook } from 'src/lib/utils/webhooks';
import { insertGlobalChannel } from 'src/lib/data/channels/insertGlobalChannel';
import ChannelCache from 'src/lib/utils/channelCache';
import { updateGlobalChannel } from 'src/lib/data/channels/updateGlobalChannel';

export default class SetGlobalGeneralMessageCommand implements MessageCommand {
  name = '!set-global-general';

  constructor(private readonly channelCache: ChannelCache) {}

  process = async (message: Message) => {
    const selectedChannel = message.channel as TextChannel;

    if (!message.guildId || !message.guild) {
      return;
    }

    if (message.member && !message.member.permissions.has('Administrator')) {
      await message.reply({
        embeds: [
          EmbedUtils.Warning(
            'You must have the `Administrator` permission to use this command.',
          ),
        ],
      });
    }

    let guildData = await getGuild(message.guildId);

    if (!guildData) {
      guildData = await insertGuild({
        id: message.guildId,
        name: message.guild.name,
        icon_url: message.guild.iconURL() || null,
      });
    }

    const globalChannels = await getGuildChannels(message.guildId);

    const selectedGlobalChannel = globalChannels.find(
      (channel) => channel.id === selectedChannel.id,
    );

    // Check if the channel is already set with the desired access
    if (
      selectedGlobalChannel &&
      selectedGlobalChannel.channel_access === 'general'
    ) {
      await message.reply({
        embeds: [
          EmbedUtils.Warning(
            'This channel is already set as a global channel with this access.',
          ),
        ],
      });
      return;
    }

    // Limit the number of global channels
    if (!selectedGlobalChannel && globalChannels.length >= 3) {
      await message.reply({
        embeds: [
          EmbedUtils.Warning('You can only have up to 3 global channels.'),
        ],
      });
      return;
    }

    // Check required permissions for the bot in the selected channel
    const permissions = selectedChannel.permissionsFor(
      await selectedChannel.guild.members.fetchMe(),
    );
    const missingPermissions = permissions.missing(
      RequiredPermissions.globalPermissions,
    );

    if (missingPermissions.length) {
      await message.reply({
        embeds: [
          EmbedUtils.Warning(
            'The bot does not have the required permissions to send messages in this channel.\n\nThe following permissions are still required:\n\n' +
              missingPermissions.join('\n'),
          ),
        ],
      });
      return;
    }

    // Create webhook if needed and update the database
    const webhook = selectedGlobalChannel
      ? new WebhookClient({ url: selectedGlobalChannel.webhook_url })
      : await createGlobalWebhook(selectedChannel);

    if (!selectedGlobalChannel) {
      await insertGlobalChannel({
        guild_id: message.guildId,
        id: selectedChannel.id,
        channel_access: 'general',
        webhook_url: webhook?.url || '',
      });

      this.channelCache.addGlobalChannel(selectedChannel.id);
    } else if (selectedGlobalChannel.channel_access !== 'general') {
      // Update the access level if it's different
      await updateGlobalChannel(selectedChannel.id, {
        channel_access: 'general',
      });
    }

    const nonce = SnowflakeUtil.generate().toString();
    await webhook.send({
      embeds: [EmbedUtils.WelcomeMessage(selectedChannel.guild, 'general')],
      username: 'Global Message',
      avatarURL:
        'https://fendqrkqasmfswadknjj.supabase.co/storage/v1/object/public/pfps/GlobalDiscordLogo.png',
      options: {
        enforceNonce: true,
        nonce,
      },
    });
  };
}
