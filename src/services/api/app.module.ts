import { DynamicModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import BroadcastManager from '../discord/broadcastManager';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
})
export class AppModule {
  static registerScheduler(broadcastManager: BroadcastManager): DynamicModule {
    return {
      module: AppModule,
      providers: [
        {
          provide: BroadcastManager,
          useValue: broadcastManager,
        },
      ],
    };
  }
}
