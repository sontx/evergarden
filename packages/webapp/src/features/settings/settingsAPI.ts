import { UpdateUserSettingsDto } from "@evergarden/shared";
import api from "../../utils/api";

export async function updateSettings(settings: UpdateUserSettingsDto) {
  await api.put(`/api/users/current/settings`, settings);
}
