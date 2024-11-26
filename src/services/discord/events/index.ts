import { Logger } from '@nestjs/common';
import { Client, ClientEvents, Message } from 'discord.js';
import { insertError } from 'src/lib/data/errors/insertError';

export interface EventHandler {
  eventName: keyof ClientEvents | string;
  process(...args: any[]): Promise<void>;
}

export default class EventManager {
  constructor(
    private readonly client: Client,
    private readonly events: EventHandler[],
  ) {}

  public async start(): Promise<void> {
    for (const event of this.events) {
      this.client.on(event.eventName, (...args: any[]) => {
        this.handle(event.process, ...args);
      });
    }
  }

  private async handle(
    process: (...args: any[]) => Promise<void>,
    ...args: any[]
  ): Promise<void> {
    try {
      await process(...args);
    } catch (error) {
      const eventData = args[0];
      let guildId: string | null = null;
      let userId: string | null = null;
      if (eventData instanceof Message) {
        guildId = eventData.guild ? eventData.guild.id : null;
        userId = eventData.author.id;
      }
      if (eventData.guild && eventData.user) {
        guildId = eventData.guild.id;
        userId = eventData.user.id;
      }

      await insertError({
        error: error.message,
        guild_id: guildId,
        user_id: userId,
      });
      Logger.error(error);
    }
  }
}
