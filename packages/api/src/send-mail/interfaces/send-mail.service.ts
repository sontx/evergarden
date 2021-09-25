import { MailModel } from "../mail.model";

export const SEND_MAIL_SERVICE_KEY = "SendMailService";

export interface ISendMailService {
  sendMail(config: MailModel, immediately: boolean): Promise<void>;
}
