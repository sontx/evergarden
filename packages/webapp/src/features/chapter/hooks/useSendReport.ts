import api from "../../../utils/api";
import { CreateReportChapterDto } from "@evergarden/shared";
import { useEnhancedMutation } from "../../../hooks/api-query/useEnhancedMutation";

async function sendReport(
  chapterId: number,
  report: CreateReportChapterDto,
): Promise<CreateReportChapterDto> {
  const response = await api.post(`/api/chapters/${chapterId}/report`, report);
  return response.data;
}

export function useSendReport(
  chapterId: number,
  report: CreateReportChapterDto,
) {
  return useEnhancedMutation<{
    chapterId: number;
    report: CreateReportChapterDto;
  }>("send-report", () => sendReport(chapterId, report));
}
