import { NestFactory } from '@nestjs/core';
import { AppModule } from './services/api/app.module';
import BotManager from './services/discord/manager';
import SchedulerManager from './services/discord/broadcastManager';
import { getScheduledMessages } from './lib/data/messages/getScheduledMessages';
import { CronJob } from 'cron';

async function bootstrap() {
  const botManager = new BotManager();
  const scheduledMessages = await getScheduledMessages();
  const scheduleMap = new Map<string, CronJob>();
  const scheduleManager = new SchedulerManager(botManager, scheduleMap);

  for (const message of scheduledMessages) {
    scheduleManager.scheduleHook(
      message.title,
      message.cron_string ? message.cron_string : new Date(message.schedule),
      message.id,
    );
  }
  const app = await NestFactory.create(
    AppModule.registerScheduler(scheduleManager),
  );
  await botManager.start();
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
