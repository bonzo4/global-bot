import {
  Body,
  Controller,
  Delete,
  Header,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import BroadcastManager from '../discord/broadcastManager';
import { getHookMessage } from 'src/lib/data/messages/getHookMessage';

type ScheduleHookBody = {
  hook_id: number;
};

@Controller('hook')
export class HookController {
  constructor(private readonly broadcastManager: BroadcastManager) {}

  @Post()
  @Header('Content-Type', 'application/json')
  @Header('Authorization', `Bearer ${process.env.HOOK_SECRET}`)
  async scheduleHook(@Body() body: ScheduleHookBody) {
    const hookMessage = await getHookMessage(body.hook_id);

    if (!hookMessage) {
      throw new HttpException('Hook message not found', HttpStatus.NOT_FOUND);
    }

    await this.broadcastManager.scheduleHook(
      hookMessage.title,
      new Date(hookMessage.schedule),
      hookMessage.id,
    );

    return { message: 'Hook Message scheduled' };
  }

  @Delete()
  @Header('Content-Type', 'application/json')
  @Header('Authorization', `Bearer ${process.env.HOOK_SECRET}`)
  async cancelHook(@Body() body: ScheduleHookBody) {
    const hookMessage = await getHookMessage(body.hook_id);

    if (!hookMessage) {
      throw new HttpException('Hook message not found', HttpStatus.NOT_FOUND);
    }

    this.broadcastManager.cancelBroadcast(hookMessage.title);
    return { message: 'Hook Message cancelled' };
  }
}
