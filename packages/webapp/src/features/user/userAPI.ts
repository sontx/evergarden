import api from "../../utils/api";
import {
  GetUserDto,
  UpdateUserDto,
  UpdateUserSettingsDto,
} from "@evergarden/shared";

export async function updateAvatar(file: File): Promise<GetUserDto> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.put("/api/users/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export async function deleteAvatar(): Promise<GetUserDto> {
  const response = await api.delete("/api/users/avatar");
  return response.data;
}

export async function updateUser(user: UpdateUserDto): Promise<GetUserDto> {
  const response = await api.put("/api/users", user);
  return response.data;
}

export async function updateUserSettings(settings: UpdateUserSettingsDto) {
  await api.put("/api/users/settings", settings);
}
