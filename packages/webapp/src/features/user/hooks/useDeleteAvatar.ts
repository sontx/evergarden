import api from "../../../utils/api";
import { GetUserDto } from "@evergarden/shared";
import { useObjectMutation } from "../../../hooks/api-query/useObjectMutation";

async function deleteAvatar(): Promise<GetUserDto> {
  const response = await api.delete("/api/users/avatar");
  return response.data;
}

export function useDeleteAvatar() {
  return useObjectMutation("delete-avatar", deleteAvatar, {
    relativeQueryKey: "user",
    updateQueryFrom: "request",
  });
}
