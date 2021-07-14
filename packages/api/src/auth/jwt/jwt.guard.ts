import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { JwtConfig } from "./jwt-config.decorator";

@Injectable()
export default class JwtGuard extends AuthGuard("jwt") {
  private config: JwtConfig;

  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    this.config = this.reflector.get<JwtConfig>("jwt-config", context.getHandler());
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (this.config && this.config.anonymous) {
      return user;
    }

    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
