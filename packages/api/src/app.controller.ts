import { Controller, Get, Session } from "@nestjs/common";

@Controller()
export class AppController {
  @Get("ping")
  getHello(@Session() session: Record<string, any>): string {
    return "pong";
  }
}
