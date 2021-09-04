import { EnhancedMutationOptions } from "../../../hooks/useEnhancedMutation";
import { useListMutation } from "../../../hooks/useListMutation";
import { UpdateReadingHistoryDto } from "@evergarden/shared";

async function updateStoryHistory(history: UpdateReadingHistoryDto) {
  const blob = new Blob([JSON.stringify(history)], {
    type: "application/json",
  });
  navigator.sendBeacon("/api/histories", blob);
}

export function useUpdateHistory(options?: EnhancedMutationOptions<UpdateReadingHistoryDto>) {
  return useListMutation("update-history", updateStoryHistory, {
    ...(options || {}),
    relativeQueryKey: "reading-history",
    updateQueryFrom: "request",
  });
}
