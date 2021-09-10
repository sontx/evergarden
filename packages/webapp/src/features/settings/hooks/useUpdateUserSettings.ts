import api from "../../../utils/api";
import { UpdateUserSettingsDto } from "@evergarden/shared";
import { useEnhancedMutation } from "../../../hooks/api-query/useEnhancedMutation";

async function updateUserSettings(
  settings: Partial<UpdateUserSettingsDto>,
): Promise<UpdateUserSettingsDto> {
  const response = await api.put("/api/users/settings", settings);
  return response.data;
}

export function useUpdateUserSettings() {
  return useEnhancedMutation("update-user-settings", updateUserSettings, {
    relativeQueryKey: "user",
    updateQueryFrom: "request",
    transformUpdateData: (next) => ({ settings: next }),
    updateQueryDataFn: (prev, next) => {
      if (prev) {
        return {
          ...prev,
          settings: {
            ...(prev.settings || {}),
            ...next,
          },
        };
      }
      return null;
    },
  });
}
