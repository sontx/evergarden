import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { StoryService } from "./story/story.service";
import StorySearchService from "./search/story-search.service";
import genresDataset from "./genres.dataset";
import { GenreService } from "./genre/genre.service";
import { UserService } from "./user/user.service";
import { ConfigService } from "@nestjs/config";
import {StorageService} from "./storage/storage.service";

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

    this.logger.debug("Synchronizing genres admin user...");
    await this.initializeAdminUser();
    this.logger.debug("Synchronized genres admin user!");

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

  private async initializeAdminUser() {
    const username = this.configService.get("credentials.admin.username");
    const password = this.configService.get("credentials.admin.password");
    if (username && password) {
      const admins = await this.userService.getAllByRole("admin");
      if (admins && admins.length > 0) {
        if (admins.length > 1) {
          this.logger.warn(`Found ${admins.length} old admin users in the database, these users will be removed!`);
          for (const admin of admins) {
            await this.userService.deleteUser(admin.id);
          }
        } else {
          const admin = admins[0];
          if (username === admin.email && password === admin.password) {
            this.logger.debug("Admin user is up to date");
          } else {
            this.logger.debug("Updating the current admin user in the database");
            await this.userService.updateUser({
              id: admin.id,
              email: username,
              password: password,
            });
          }
        }
      } else {
        this.logger.debug("Admin user was not found, adding new one to the database");
        await this.userService.addUser({
          email: username,
          password: password,
          fullName: username,
          role: "admin",
        });
      }
    }
  }
}
