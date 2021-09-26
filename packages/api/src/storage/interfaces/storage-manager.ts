import { BufferedFile } from "../file.model";
import { Sharp } from "sharp";

export interface IStorageManager {
  buildUrl(name: string): string;
  optimizeImage(content: Buffer): Promise<Buffer>;
  validateFileImage(file: BufferedFile);
  resizeImage(sharp: Sharp, preferWidth: number, preferHeight?: number): Promise<Sharp>;
  randomImageFileName(): string;

  initializeIfNeeded(): Promise<void>;
  uploadAndReplace<T>(folderName: string, action: () => Promise<T>): Promise<T>;
  saveImage(fileName: string, sharp: Sharp): Promise<void>;
  removeFolder(name: string): Promise<void>;
}
