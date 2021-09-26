import { Logger } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { MailModel } from "./mail.model";
import { ISendMailService } from "./interfaces/send-mail.service";

export abstract class AbstractSendMailService implements ISendMailService {
  private readonly logger = new Logger(AbstractSendMailService.name);

  protected constructor(private mailerService: MailerService) {}

  async sendMail(config: MailModel, immediately = false) {
    if (immediately) {
      await this.sendMailNow(config);
    } else {
      await this.enqueue(config);
    }
  }

  protected abstract enqueue(config: MailModel): Promise<void>;

  protected async sendMailNow(config: MailModel) {
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
}
