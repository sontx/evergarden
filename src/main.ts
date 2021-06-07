import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { TruyenfullBrowserService } from "./truyenfull/truyenfull-browser.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const service = await app.get(TruyenfullBrowserService);
  await service.getStories(0, 5, 3);
}
bootstrap();
