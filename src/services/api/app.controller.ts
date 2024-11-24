import { Controller, Get } from '@nestjs/common';
import BotManager from '../discord/manager';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'Hello World!';
    // return this.appService.getHello();
  }
}
