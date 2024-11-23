import { Injectable, Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  Client,
  Collection,
  REST,
  RESTGetCurrentApplicationResult,
  Routes,
  Shard,
  ShardingManager,
} from 'discord.js';

@Injectable()
export default class BotManager {
  public manager: ShardingManager;

  public async start() {
    Logger.log('Starting bot manager');
    const manager = new ShardingManager(
      './dist/services/discord/start-bot.js',
      {
        token: process.env.DISCORD_TOKEN,
      },
    );

    this.manager = manager;

    const serverCount = await this.getServerCount();
    Logger.log(`Server count: ${serverCount}`);

    await manager.spawn({
      amount: Math.ceil(serverCount / 100),
      delay: 5000,
    });
  }

  private async getServerCount(): Promise<number> {
    let rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);
    const response = await rest.get(Routes.currentApplication());
    const data = response as RESTGetCurrentApplicationResult;

    const serverCount = data.approximate_guild_count;

    if (!serverCount) {
      throw new Error('Failed to fetch application data');
    }

    return serverCount;
  }

  public broadcastAPI() {
    this.manager.broadcastEval((client) => {
      Logger.log('Broadcasting API event', client.user?.username);
      client.emit('broadcastAPI', { message: 'Hello from API' });
    });
  }
}
