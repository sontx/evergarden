import { useUser } from "../../user/hooks/useUser";
import { defaultUserSettings } from "../../../utils/user-settings-config";

export function useUserSettings() {
  const { data: user, ...rest } = useUser();
  return { ...rest, data: user?.settings || defaultUserSettings };
}
