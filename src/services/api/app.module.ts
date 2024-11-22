import { DynamicModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import BotManager from '../discord/manager';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
})
export class AppModule {
  static registerBotManager(botManager: BotManager): DynamicModule {
    return {
      module: AppModule,
      providers: [
        {
          provide: BotManager,
          useValue: botManager,
        },
      ],
    };
  }
}
