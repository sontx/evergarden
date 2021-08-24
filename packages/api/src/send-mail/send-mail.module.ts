import { Module } from "@nestjs/common";
import { SendMailService } from "./send-mail.service";
import { MailerModule } from "@nestjs-modules/mailer";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { BullModule } from "@nestjs/bull";

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          transport: {
            host: configService.get("sendMail.host"),
            secure: false,
            auth: {
              user: configService.get("sendMail.username"),
              pass: configService.get("sendMail.password"),
            },
          },
          defaults: {
            from: configService.get("sendMail.defaultFrom"),
          },
          preview: configService.get("isDevelopment"),
        };
      },
    }),
    BullModule.registerQueue({
      name: "email",
    }),
  ],
  providers: [SendMailService],
  exports: [SendMailService],
})
export class SendMailModule {}
