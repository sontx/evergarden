import { Controller, Get } from "@nestjs/common";
import { isDevelopment, useMicroservices } from "./common/utils";
import { ConfigService } from "@nestjs/config";

@Controller()
export class AppController {
  constructor(private configService: ConfigService) {}

  @Get("ping")
  ping(): string {
    return "pong";
  }

  @Get("info")
  getInfo() {
    return {
      development: isDevelopment(),
      microservices: useMicroservices(),
      storageUrl: this.configService.get("storage.host"),
      credentialsGoogle: !!this.configService.get("credentials.google.clientId"),
      settings: this.configService.get("settings"),
      email:
        !!this.configService.get("sendMail.host") &&
        !!this.configService.get("sendMail.username") &&
        !!this.configService.get("sendMail.password"),
    };
  }
}
