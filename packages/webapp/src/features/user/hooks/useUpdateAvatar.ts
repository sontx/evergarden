import api from "../../../utils/api";
import { GetUserDto } from "@evergarden/shared";
import { useObjectMutation } from "../../../hooks/api-query/useObjectMutation";

async function updateAvatar(file: File | Blob): Promise<GetUserDto> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.put("/api/users/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export function useUpdateAvatar() {
  return useObjectMutation<File | Blob>("update-avatar", updateAvatar, {
    relativeQueryKey: "user",
    updateQueryFrom: "response",
  });
}
