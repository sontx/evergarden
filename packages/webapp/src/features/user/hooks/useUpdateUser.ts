import api from "../../../utils/api";
import { GetUserDto, UpdateUserDto } from "@evergarden/shared";
import { useObjectMutation } from "../../../hooks/api-query/useObjectMutation";

async function updateUser(user: UpdateUserDto): Promise<GetUserDto> {
  const response = await api.put("/api/users", user);
  return response.data;
}

export function useUpdateUser() {
  return useObjectMutation<UpdateUserDto>("update-user", updateUser, {
    relativeQueryKey: "user",
    updateQueryFrom: "request",
  });
}
