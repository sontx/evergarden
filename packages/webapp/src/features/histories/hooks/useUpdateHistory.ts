import { EnhancedMutationOptions } from "../../../hooks/api-query/useEnhancedMutation";
import { useListMutation } from "../../../hooks/api-query/useListMutation";
import { UpdateReadingHistoryDto } from "@evergarden/shared";
import { updateListObjects } from "../../../utils/list-utils";
import { useIsLoggedIn } from "../../user/hooks/useIsLoggedIn";
import { LocalReadingHistory } from "../local-reading-history";

async function updateStoryHistory(history: UpdateReadingHistoryDto) {
  const blob = new Blob([JSON.stringify(history)], {
    type: "application/json",
  });
  navigator.sendBeacon("/api/histories", blob);
}

export function useUpdateHistory(
  options?: EnhancedMutationOptions<UpdateReadingHistoryDto>,
) {
  const isLoggedIn = useIsLoggedIn();
  return useListMutation(
    "update-history",
    (data) =>
      isLoggedIn
        ? updateStoryHistory(data)
        : Promise.resolve(LocalReadingHistory.update(data)),
    {
      ...(options || {}),
      relativeQueryKey: "reading-history",
      updateQueryFrom: "request",
      updateQueryDataFn: (prev, next) => {
        if (!prev) {
          return [next];
        }
        return updateListObjects(
          prev,
          next,
          (item1, item2) => item1.storyId === item2.storyId,
        );
      },
    },
  );
}
