import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AppService } from "./app.service";
import { TruyenfullBrowserService } from "./truyenfull/truyenfull-browser.service";
import { TruyenfullVerifyService } from "./truyenfull/truyenfull-verify.service";
import { TruyencvService } from "./truyencv/truyencv.service";
import { TruyenfullTruyencvService } from "./truyenfull-truyencv/truyenfull-truyencv.service";

@Module({
  providers: [
    AppService,
    TruyenfullBrowserService,
    TruyenfullVerifyService,
    TruyencvService,
    TruyenfullTruyencvService,
  ],
})
export class AppModule {}
