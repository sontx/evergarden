import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import * as cookieParser from "cookie-parser";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { isDevelopment } from "./common/utils";
import { DelayedRequestInterceptor } from "./common/delayed-request.interceptor";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(cookieParser());
  app.setGlobalPrefix("api");

  const config = new DocumentBuilder().setTitle("Evergarden APIs").setVersion("1.0").build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  if (isDevelopment()) {
    app.useGlobalInterceptors(new DelayedRequestInterceptor());
  }

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const configService = app.get(ConfigService);
  await app.listen(configService.get("port"));
}

bootstrap();
