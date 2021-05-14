import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import configuration from "./configuration";
import { UserModule } from "./user/user.module";
import { StoryModule } from './story/story.module';

@Module({
  imports: [
    PassportModule,
    ConfigModule.forRoot({
      envFilePath: [".env.development.local", ".env.development"],
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: "mongodb",
          url: configService.get("database.mongodb.connectionString"),
          database: configService.get("database.mongodb.databaseName"),
          entities: [__dirname + "/**/*.entity{.ts,.js}"],
          ssl: true,
          useUnifiedTopology: true,
          useNewUrlParser: true,
          isGlobal: true,
        };
      },
    }),
    AuthModule,
    UserModule,
    StoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
