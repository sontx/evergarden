import { useOAuthLogin } from "./useOAuthLogin";

export function useOAuthFacebook() {
  const { mutate, ...rest } = useOAuthLogin();
  return {
    ...rest,
    mutate: (token: string) => mutate({ token, provider: "facebook" }),
  };
}
