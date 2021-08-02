import { Page } from "puppeteer";
import * as fs from "fs";

export abstract class CommonService {
  private static readonly UserAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36",
    "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:88.0) Gecko/20100101 Firefox/88.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; rv:78.0) Gecko/20100101 Firefox/78.0",
    "Mozilla/5.0 (X11; Linux x86_64; rv:88.0) Gecko/20100101 Firefox/88.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:88.0) Gecko/20100101 Firefox/88.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36 Edg/90.0.818.66",
  ];

  protected print(msg: string, color: string) {
    console.log(`%c${msg}`, `color: ${color}`)
  }

  private randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  protected randomUserAgent = () => {
    const pos = this.randomInt(0, CommonService.UserAgents.length - 1);
    return CommonService.UserAgents[pos];
  };

  protected async hasElement(page: Page, selector: string): Promise<boolean> {
    return await page.evaluate((selector) => !!document.querySelector(selector), selector);
  }

  private createFileIfNeeded(fileName: string) {
    if (!fs.existsSync(fileName)) {
      fs.writeFileSync(fileName, "");
    }
  }

  protected appendLine(fileName: string, line: string) {
    this.createFileIfNeeded(fileName);
    fs.appendFileSync(fileName, line + "\n", { encoding: "utf8" });
  }

  protected hasLine(fileName: string, line: string) {
    this.createFileIfNeeded(fileName);
    const log = fs.readFileSync(fileName, { encoding: "utf8" });
    return log.includes(line);
  }

  protected async delay(mills: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, mills);
    });
  }

  protected setTerminalTitle(title: string) {
    process.stdout.write(String.fromCharCode(27) + "]0;" + title + String.fromCharCode(7));
  }
}
