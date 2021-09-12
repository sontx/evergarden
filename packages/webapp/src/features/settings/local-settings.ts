import { GetUserSettingsDto, UpdateUserSettingsDto } from "@evergarden/shared";
import { defaultUserSettings } from "../../utils/user-settings-config";

export class LocalSettings {
  private static readonly key = "settings";
  private static cachedData: GetUserSettingsDto;

  static get() {
    if (!this.cachedData) {
      const settingsValue = localStorage.getItem(this.key);
      this.cachedData = settingsValue
        ? JSON.parse(settingsValue)
        : defaultUserSettings;
    }
    return this.cachedData;
  }

  static update(updateData: UpdateUserSettingsDto) {
    const previousData = this.get();
    this.cachedData = {
      ...previousData,
      ...updateData,
    };
    localStorage.setItem(this.key, JSON.stringify(this.cachedData));
    return this.cachedData;
  }
}
