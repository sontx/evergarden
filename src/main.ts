import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { TruyenfullBrowserService } from "./truyenfull/truyenfull-browser.service";
import { TruyenfullVerifyService } from "./truyenfull/truyenfull-verify.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const crawler = await app.get(TruyenfullBrowserService);
  // await crawler.getStories(101, 200, 10);
  const verifier = await app.get(TruyenfullVerifyService);
  await verifier.fixStories();
}
bootstrap();
