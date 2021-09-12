import api from "../../../utils/api";
import { UpdateUserSettingsDto } from "@evergarden/shared";
import { useEnhancedMutation } from "../../../hooks/api-query/useEnhancedMutation";
import { useIsLoggedIn } from "../../user/hooks/useIsLoggedIn";
import { LocalSettings } from "../local-settings";

async function updateUserSettings(
  settings: UpdateUserSettingsDto,
): Promise<UpdateUserSettingsDto> {
  const response = await api.put("/api/users/settings", settings);
  return response.data;
}

export function useUpdateUserSettings() {
  const isLoggedIn = useIsLoggedIn();
  return useEnhancedMutation(
    "update-user-settings",
    (data) =>
      isLoggedIn
        ? updateUserSettings(data)
        : Promise.resolve(LocalSettings.update(data)),
    {
      relativeQueryKey: "user",
      updateQueryFrom: "request",
      updateQueryDataFn: (prev, next) => {
        return {
          ...(prev || {}),
          settings: {
            ...(prev?.settings || LocalSettings.get()),
            ...next,
          },
        };
      },
    },
  );
}
