import { Controller, Post } from '@nestjs/common';
import BotManager from '../discord/manager';

@Controller('hooks')
export class HookController {
  constructor(private readonly botManager: BotManager) {}

  @Post()
  scheduleHook() {}
}
