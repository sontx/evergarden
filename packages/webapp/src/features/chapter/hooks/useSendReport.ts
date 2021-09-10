import api from "../../../utils/api";
import { CreateReportChapterDto } from "@evergarden/shared";
import { useEnhancedMutation } from "../../../hooks/api-query/useEnhancedMutation";

async function reportBugChapter(
  chapterId: number,
  report: CreateReportChapterDto,
): Promise<CreateReportChapterDto> {
  const response = await api.post(`/api/chapters/${chapterId}/report`, report);
  return response.data;
}

export function useSendReport() {
  return useEnhancedMutation<{
    chapterId: number;
    report: CreateReportChapterDto;
  }>("send-report", (data) => reportBugChapter(data.chapterId, data.report));
}
