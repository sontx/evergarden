import { BufferedFile } from "../file.model";

export const USER_STORAGE_SERVICE_KEY = "UserStorageService";

export interface IUserStorageService {
  upload(file: BufferedFile, userId: number): Promise<string>;
  remove(userId: number): Promise<void>;
  removeAvatar(userId: number): Promise<void>;
}
