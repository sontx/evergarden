import { useUser } from "../../user/hooks/useUser";
import { LocalSettings } from "../local-settings";

export function useUserSettings() {
  const { data: user, ...rest } = useUser();
  return { ...rest, data: user?.settings || LocalSettings.get() };
}
