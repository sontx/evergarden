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

export async function updateFullName(name: string): Promise<AuthUser> {
  const response = await api.put("/api/users", { fullName: name });
  return response.data;
}

export async function updateAvatar(file: File): Promise<AuthUser> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.put("/api/users/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export async function deleteAvatar(): Promise<AuthUser> {
  const response = await api.delete("/api/users/avatar")
  return response.data;
}
