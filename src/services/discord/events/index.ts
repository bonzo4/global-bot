import { Client, ClientEvents } from 'discord.js';

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
      console.error(error);
    }
  }
}
