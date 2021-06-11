import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { TruyenfullBrowserService } from "./truyenfull/truyenfull-browser.service";
import { TruyenfullVerifyService } from "./truyenfull/truyenfull-verify.service";

@Module({
  imports: [],
  providers: [AppService, TruyenfullBrowserService, TruyenfullVerifyService],
})
export class AppModule {}
