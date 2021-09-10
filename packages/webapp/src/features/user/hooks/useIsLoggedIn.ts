import { useUser } from "./useUser";

export function useIsLoggedIn() {
  const { data: user } = useUser();
  return !!user;
}
