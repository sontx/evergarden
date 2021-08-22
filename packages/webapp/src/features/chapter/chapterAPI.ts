import { GetChapterDto, ReportChapterDto } from "@evergarden/shared";
import api from "../../utils/api";

export async function fetchChapter(
  storyId: number,
  chapterNo: number,
): Promise<GetChapterDto> {
  const response = await api.get(
    `/api/stories/${storyId}/chapters/${chapterNo}`,
  );
  return response.data;
}

export async function reportBugChapter(
  storyId: number,
  chapterId: number,
  report: ReportChapterDto,
): Promise<ReportChapterDto> {
  const response = await api.post(
    `/api/stories/${storyId}/${chapterId}/report`,
    report,
  );
  return response.data;
}
