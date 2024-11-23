import { Logger } from '@nestjs/common';
import Bot from './bot';

async function start() {
  const bot = new Bot();

  await bot.start();
}

process.on('unhandledRejection', (error) => {
  Logger.error('Unhandled promise rejection:', error);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  Logger.error('Uncaught exception:', error);
  process.exit(1);
});

start();
