import { throttle } from "throttle-debounce";
import { Logger } from "@nestjs/common";

export abstract class DelayedQueueService {
  private readonly logger = new Logger(DelayedQueueService.name);

  protected constructor(private readonly delayMillis = 5000) {}

  private readonly queue: {
    [x: string]: {
      value: any;
      notice: (id: number, value: any) => void;
    };
  } = {};

  enqueue(id: number, value: any) {
    let current = this.queue[`${id}`];
    if (current) {
      current.value = this.onMerge(current.value, value);
    } else {
      current = this.queue[`${id}`] = {
        value,
        notice: throttle(this.delayMillis, true, (argId, argValue) => {
          this.onExecute(argId, argValue).then();
          this.logger.debug(`Dequeued ${argId} with ${JSON.stringify(argValue)}`);
          delete this.queue[`${argId}`];
        }),
      };
    }
    current.notice(id, current.value);
  }

  protected abstract onMerge(current: any, newValue: any): any;

  protected abstract onExecute(id: number, value: any): Promise<void>;
}
