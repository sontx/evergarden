import { Injectable } from "@nestjs/common";
import { MailModel } from "../mail.model";
import { MailerService } from "@nestjs-modules/mailer";
import { AbstractSendMailService } from "../abstract-send-mail.service";
import Timeout = NodeJS.Timeout;

@Injectable()
export class LocalSendMailService extends AbstractSendMailService {
  private readonly queue: MailModel[] = [];
  private internalId: Timeout;

  constructor(mailerService: MailerService) {
    super(mailerService);
  }

  enqueue(config: MailModel): Promise<void> {
    this.queue.push(config);
    if (this.internalId === undefined) {
      this.internalId = setInterval(this.dequeue.bind(this), 2000);
    }
    return Promise.resolve();
  }

  private dequeue() {
    const mail = this.queue.shift();
    if (mail) {
      this.sendMailNow(mail).then();
    }

    if (this.queue.length === 0 && this.internalId !== undefined) {
      clearInterval(this.internalId);
      this.internalId = undefined;
    }
  }
}
