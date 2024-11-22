import { Controller, Get } from '@nestjs/common';
import BotManager from '../discord/manager';

@Controller()
export class AppController {
  constructor(private readonly botManager: BotManager) {}

  @Get()
  getHello(): string {
    this.botManager.broadcastAPI();
    return 'Hello World!';
    // return this.appService.getHello();
  }
}
