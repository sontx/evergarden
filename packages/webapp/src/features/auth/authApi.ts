import { AuthUser } from "@evergarden/shared";
import Logger from "js-logger";
import api from "../../utils/api";

export interface LoggedInData {
  user: AuthUser;
}

export async function logout() {
  try {
    return await api.post("/api/auth/logout");
  } catch (error) {
    Logger.error(error);
  }
}

export async function fetchAuthenticatedUser() {
  const response = await api.get("/api/auth");
  return response.data;
}

export async function loginOAuth2(token: string, provider: string): Promise<AuthUser> {
  const response = await api.post("/api/auth", {
    token,
    provider
  });
  return response.data;
}

