import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { StoryService } from "./story/story.service";
import StorySearchService from "./search/story-search.service";
import genresDataset from "./genres.dataset";
import { GenreService } from "./genre/genre.service";
import { UserService } from "./user/user.service";
import { ConfigService } from "@nestjs/config";
import { StorageService } from "./storage/storage.service";
import { Role } from "@evergarden/shared";

@Injectable()
export class AppService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private storyService: StoryService,
    private storySearchService: StorySearchService,
    private genreService: GenreService,
    private userService: UserService,
    private configService: ConfigService,
    private storageService: StorageService,
  ) {}

  async onApplicationBootstrap() {
    this.logger.debug("Synchronizing search engine...");
    await this.initializeSearchEngine();
    this.logger.debug("Synchronized search engine!");

    this.logger.debug("Synchronizing genres dataset...");
    await this.initializeGenresDataset();
    this.logger.debug("Synchronized genres dataset!");

    this.logger.debug("Synchronizing initial users...");
    await this.initializeUsers();
    this.logger.debug("Synchronized initial users!");

    this.logger.debug("Initializing storage service...");
    await this.storageService.initialize();
    this.logger.debug("Initialized storage service!");
  }

  private async initializeSearchEngine() {
    const stories = await this.storyService.getAll();
    await this.storySearchService.createIndex(stories);
  }

  private async initializeGenresDataset() {
    await this.genreService.syncGenres(genresDataset.map((item) => item.name));
  }

  private async initializeUsers() {
    const adminUsername = this.configService.get("credentials.admin.username");
    const adminPassword = this.configService.get("credentials.admin.password");
    await this.initializeUser(adminUsername, adminPassword, "admin");

    const botUsername = this.configService.get("credentials.bot.username");
    const botPassword = this.configService.get("credentials.bot.password");
    await this.initializeUser(botUsername, botPassword, "user");
  }

  private async initializeUser(username: string, password: string, role: Role) {
    const user = await this.userService.getOneByRoleAndProvider(role, "system");
    if (user) {
      await this.userService.updateUser({
        id: user.id,
        email: username,
        password,
        fullName: username,
      });
    } else {
      await this.userService.addUser({
        email: username,
        password,
        fullName: username,
        provider: "system",
        role,
      });
    }
  }
}
