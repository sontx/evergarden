import { Module } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { BullModule } from "@nestjs/bull";
import { useMicroservices } from "../common/utils";
import { SEND_MAIL_SERVICE_KEY } from "./interfaces/send-mail.service";
import { LocalSendMailService } from "./local/local-send-mail.service";
import { BullSendMailService } from "./bull/bull-send-mail.service";

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
    useMicroservices() &&
      BullModule.registerQueue({
        name: "email",
      }),
  ].filter(Boolean),
  providers: [
    {
      provide: SEND_MAIL_SERVICE_KEY,
      useClass: useMicroservices() ? BullSendMailService : LocalSendMailService,
    },
  ],
  exports: [SEND_MAIL_SERVICE_KEY],
})
export class SendMailModule {}
