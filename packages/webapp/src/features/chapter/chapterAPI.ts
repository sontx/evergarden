import { GetChapterDto, CreateReportChapterDto } from "@evergarden/shared";
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
  chapterId: number,
  report: CreateReportChapterDto,
): Promise<CreateReportChapterDto> {
  const response = await api.post(`/api/chapters/${chapterId}/report`, report);
  return response.data;
}
