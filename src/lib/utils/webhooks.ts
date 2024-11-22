import { TextChannel } from 'discord.js';
import { ChannelAccess } from '../types/channels';

export async function createGlobalWebhook(channel: TextChannel) {
  const webhook = await channel.createWebhook({
    name: `Global Chat`,
    avatar:
      'https://fendqrkqasmfswadknjj.supabase.co/storage/v1/object/public/pfps/GlobalDiscordLogo.png',
  });

  return webhook;
}
