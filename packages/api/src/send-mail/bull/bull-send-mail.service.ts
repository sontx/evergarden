import { Injectable } from "@nestjs/common";
import { InjectQueue, Process, Processor } from "@nestjs/bull";
import { Job, Queue } from "bull";
import { MailModel } from "../mail.model";
import { AbstractSendMailService } from "../abstract-send-mail.service";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
@Processor("email")
export class BullSendMailService extends AbstractSendMailService {
  constructor(@InjectQueue("email") private emailQueue: Queue, mailerService: MailerService) {
    super(mailerService);
  }

  async enqueue(config: MailModel): Promise<void> {
    await this.emailQueue.add(config);
  }

  @Process()
  private async processEmailQueue(job: Job<MailModel>) {
    await this.sendMailNow(job.data);
  }
}
