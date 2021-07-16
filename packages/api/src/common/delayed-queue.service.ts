// eslint-disable-next-line @typescript-eslint/no-var-requires
const throttle = require("lodash.throttle");
import { Logger } from "@nestjs/common";

export abstract class DelayedQueueService<T> {
  private readonly logger = new Logger(DelayedQueueService.name);

  private readonly queue: {
    [x: string]: {
      value: any;
      notice: (id: any, value: any) => void;
    };
  } = {};

  protected constructor(private readonly delayMillis = 5000) {}

  enqueue(id: T, value: any) {
    const key = `${id}`;
    let current = this.queue[key];
    if (current) {
      current.value = this.onMerge(current.value, value);
    } else {
      this.queue[key] = {
        value: this.onMerge(undefined, value),
        notice: throttle(
          (argId, argValue) => {
            this.onExecute(argId, argValue).then();
            this.logger.debug(`Dequeued ${argId} with ${JSON.stringify(argValue)}`);
            delete this.queue[`${argId}`];
          },
          this.delayMillis,
          { leading: false },
        ),
      };
      current = this.queue[key];
    }
    current.notice(id, current.value);
  }

  protected abstract onMerge(current: any, newValue: any): any;

  protected abstract onExecute(id: any, value: any): Promise<void>;
}
