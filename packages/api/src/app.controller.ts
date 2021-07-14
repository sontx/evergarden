import { Controller, Get, UseGuards } from "@nestjs/common";
import JwtGuard from "./auth/jwt/jwt.guard";
import { RolesGuard } from "./auth/role/roles.guard";

@Controller()
export class AppController {
  @UseGuards(JwtGuard, RolesGuard)
  @Get("hello")
  getHello(): string {
    return "hello";
  }
}
