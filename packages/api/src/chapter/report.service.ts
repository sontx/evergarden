import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Chapter } from "./chapter.entity";
import { User } from "../user/user.entity";
import * as moment from "moment";
import { CreateReportChapterDto } from "@evergarden/shared";
import { StoryService } from "../story/story.service";
import { UserService } from "../user/user.service";
import { ISendMailService, SEND_MAIL_SERVICE_KEY } from "../send-mail/interfaces/send-mail.service";

@Injectable()
export class ReportService {
  constructor(
    private storyService: StoryService,
    private userService: UserService,
    @Inject(SEND_MAIL_SERVICE_KEY)
    private sendMailService: ISendMailService,
  ) {}

  async report(chapter: Chapter, report: CreateReportChapterDto, userId?: number) {
    const to = chapter.updatedBy.email?.toLowerCase();
    if (!to) {
      return;
    }

    let user: User;
    if (userId) {
      user = await this.userService.getById(userId);
    }

    const story = await this.storyService.getStory(chapter.storyId);

    if (!story) {
      throw new NotFoundException(`Story was not found`);
    }

    const cc = [chapter.createdBy.email, story.createdBy.email, story.updatedBy.email].filter(
      (email) => !!email && email.toLowerCase() !== to,
    );
    const from = user ? `Report from <strong>${user.fullName}</strong>` : "Report from guest";
    await this.sendMailService.sendMail(
      {
        to,
        cc: cc.join(", "),
        subject: `[${story.title}] report chapter ${chapter.chapterNo}` + (chapter.title ? ` - ${chapter.title}` : ""),
        htmlBody: `
${from}
<ul>
<li>Type: ${report.type}</li>
<li>Detail: ${report.detail || "No Detail"}</li>
<li>Report at: ${moment().add(7, "hours").format("HH:mm DD/MM/YYYY")}</li>
</ul>
</ul>`,
      },
      false,
    );
  }
}
