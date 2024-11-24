import { NestFactory } from '@nestjs/core';
import { AppModule } from './services/api/app.module';
import BotManager from './services/discord/manager';
import SchedulerManager from './services/discord/broadcastManager';

async function bootstrap() {
  const botManager = new BotManager();
  const app = await NestFactory.create(
    AppModule.registerScheduler(new SchedulerManager(botManager, new Map())),
  );
  await botManager.start();
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
