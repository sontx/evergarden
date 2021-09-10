import api, { handleRequestError } from "../../../utils/api";
import ms from "ms";
import { AuthUser } from "@evergarden/shared";
import { useErrorHandler } from "../../../hooks/api-query/useErrorHandler";
import { useQueryClient } from "react-query";
import { useSimpleQuery } from "../../../hooks/api-query/useSimpleQuery";

async function fetchAuthenticatedUser(): Promise<AuthUser> {
  const response = await api.get("/api/auth", { skipAuthRefresh: true } as any);
  return response.data;
}

export function useUser() {
  const errorHandler = useErrorHandler();
  const queryClient = useQueryClient();
  return useSimpleQuery("user", fetchAuthenticatedUser, {
    staleTime: ms("2h"),
    cacheTime: ms("4h"),
    silent: true,
    onError: async (err) => {
      const errorDetails = handleRequestError(err as any);
      if (errorDetails.code !== 401) {
        errorHandler(err);
      } else {
        queryClient.setQueryData("user", null);
      }
    },
    retry: (failureCount, error) => {
      const errorDetails = handleRequestError(error as any);
      if (errorDetails.code === 401) {
        return false;
      }
      return failureCount <= 3;
    },
    enabled: localStorage.getItem("isLoggedIn") === "true",
  });
}
