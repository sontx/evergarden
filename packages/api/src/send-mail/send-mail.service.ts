import { Injectable, Logger } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { MailModel } from "./mail.model";
import { InjectQueue, Process, Processor } from "@nestjs/bull";
import { Job, Queue } from "bull";

@Injectable()
@Processor("email")
export class SendMailService {
  private readonly logger = new Logger(SendMailService.name);

  constructor(private mailerService: MailerService, @InjectQueue("email") private emailQueue: Queue) {}

  async sendMail(config: MailModel, immediately = false) {
    if (immediately) {
      await this.sendMailNow(config);
    } else {
      await this.emailQueue.add(config);
    }
  }

  private async sendMailNow(config: MailModel) {
    this.logger.log(`Sending mail to ${config.to}`);
    await this.mailerService.sendMail({
      to: config.to,
      subject: config.subject,
      cc: config.cc,
      text: config.textBody,
      html: config.htmlBody,
    });
    this.logger.log(`Sent mail to ${config.to}`);
  }

  @Process()
  private async processEmailQueue(job: Job<MailModel>) {
    await this.sendMailNow(job.data);
  }
}
