import { Injectable, Logger } from '@nestjs/common';
import BotManager from './manager';
import { CronJob } from 'cron';
import { broadcastHookMessage } from 'src/lib/utils/broadcast';

@Injectable()
export default class BroadcastManager {
  constructor(
    private readonly botManager: BotManager,
    private readonly schedule: Map<string, CronJob>,
  ) {}

  public async scheduleHook(
    cronName: string,
    cronString: string | Date,
    messageId: number,
  ) {
    const job = new CronJob(cronString, async () => {
      await this.botManager.manager.broadcastEval(broadcastHookMessage, {
        context: { messageId },
      });
      if (cronString instanceof Date) this.cancelBroadcast(cronName);
    });
    Logger.log(`Scheduling broadcast for ${cronName}`);
    this.schedule.set(cronName, job);
    job.start();
  }

  public cancelBroadcast(cronName: string) {
    const job = this.schedule.get(cronName);
    if (job) {
      job.stop();
      this.schedule.delete(cronName);
    }
  }
}
