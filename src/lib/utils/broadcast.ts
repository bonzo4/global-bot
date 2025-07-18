import { Client } from 'discord.js';

export function broadcastWarning(
  client: Client,
  {
    warning,
    userId,
    sourceChannelId,
  }: { warning: string; userId: string; sourceChannelId: string },
) {
  client.emit('globalWarning', { warning, userId, sourceChannelId });
}

export function broadcastHookMessage(
  client: Client,
  { messageId }: { messageId: number },
) {
  client.emit('hookMessage', { messageId });
}
