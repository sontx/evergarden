import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class DelayedRequestInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(next.handle());
      }, 0);
    });
  }
}
