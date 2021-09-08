import api from "../../../utils/api";
import Logger from "js-logger";
import { useEnhancedMutation } from "../../../hooks/api-query/useEnhancedMutation";
import { useQueryClient } from "react-query";

async function logout() {
  try {
    return await api.post("/api/auth/logout");
  } catch (error) {
    Logger.error(error);
  }
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useEnhancedMutation("logout", logout, {
    onSettled: async () => {
      localStorage.removeItem("isLoggedIn");
      await queryClient.resetQueries("user");
    },
  });
}
