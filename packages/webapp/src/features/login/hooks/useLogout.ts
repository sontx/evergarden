import api from "../../../utils/api";
import Logger from "js-logger";
import { useEnhancedMutation } from "../../../hooks/api-query/useEnhancedMutation";

async function logout() {
  try {
    return await api.post("/api/auth/logout");
  } catch (error) {
    Logger.error(error);
  }
}

export function useLogout() {
  return useEnhancedMutation<void>("logout", logout, {
    onSettled: async () => {
      localStorage.removeItem("isLoggedIn");
      window.location.reload();
    },
  });
}
