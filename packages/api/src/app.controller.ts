import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import JwtGuard from './auth/jwt/jwt.guard';
import { Role } from './auth/role/roles.decorator';
import { RolesGuard } from './auth/role/roles.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(JwtGuard, RolesGuard)
  @Get("hello")
  getHello(): string {
    return this.appService.getHello();
  }
}
