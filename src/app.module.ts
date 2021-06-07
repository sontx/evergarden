import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { TruyenfullBrowserService } from "./truyenfull/truyenfull-browser.service";

@Module({
  imports: [],
  providers: [AppService, TruyenfullBrowserService],
})
export class AppModule {}
