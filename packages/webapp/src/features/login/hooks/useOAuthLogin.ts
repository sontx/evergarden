import { useEnhancedMutation } from "../../../hooks/api-query/useEnhancedMutation";
import { AuthUser } from "@evergarden/shared";
import { useQueryClient } from "react-query";
import api from "../../../utils/api";

async function oauthLogin(token: string, provider: string): Promise<AuthUser> {
  const response = await api.post("/api/auth", {
    token,
    provider,
  });
  return response.data;
}

export function useOAuthLogin() {
  const queryClient = useQueryClient();
  return useEnhancedMutation<
    { provider: "facebook" | "google"; token: string },
    AuthUser
  >("login-with-facebook", (data) => oauthLogin(data.token, data.provider), {
    onSuccess: (data) => {
      localStorage.setItem("isLoggedIn", "true");
      queryClient.setQueryData("user", data);
    },
  });
}
