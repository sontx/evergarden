export interface MailModel {
  to: string;
  cc?: string;
  subject: string;
  htmlBody?: string;
  textBody?: string;
}
