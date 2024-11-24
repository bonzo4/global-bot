import { Injectable } from '@nestjs/common';
import BotManager from './manager';
import { CronJob } from 'cron';

@Injectable()
export default class BroadcastManager {
  constructor(
    private readonly botManager: BotManager,
    private readonly schedule: Map<string, CronJob>,
  ) {}

  public async scheduleBroadcast(
    cronName: string,
    cronString: string | Date,
    eventName: string,
    ...args: any[]
  ) {
    const job = new CronJob(cronString, async () => {
      await this.botManager.manager.broadcastEval((client) => {
        client.emit(eventName, ...args);
      });
    });

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
