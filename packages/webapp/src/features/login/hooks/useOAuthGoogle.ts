import { useOAuthLogin } from "./useOAuthLogin";

export function useOAuthGoogle() {
  const { mutate, ...rest } = useOAuthLogin();
  return {
    ...rest,
    mutate: (token: string) => mutate({ token, provider: "google" }),
  };
}
