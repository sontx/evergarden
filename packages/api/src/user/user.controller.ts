import { Controller, Get, Logger, NotFoundException, Param } from "@nestjs/common";
import { GetUserDto } from "@evergarden/shared";
import { UserService } from "./user.service";

@Controller("users")
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private userService: UserService) {}

  @Get("ping/:id")
  async getUser(@Param("id") id: string): Promise<GetUserDto> {
    try {
      const user = await this.userService.getById(id);
      if (!user) {
        throw new NotFoundException();
      }
      return {
        id,
        fullName: user.fullName,
      };
    } catch (e) {
      this.logger.warn(`Not found user id ${id}`, e);
      throw new NotFoundException();
    }
  }
}
