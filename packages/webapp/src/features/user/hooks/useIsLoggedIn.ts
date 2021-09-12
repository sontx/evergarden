import { useUser } from "./useUser";

export function useIsLoggedIn() {
  const { data: user, isLoading } = useUser();
  return {isLoggedIn: !!user && typeof user.id === "number", isLoading};
}
