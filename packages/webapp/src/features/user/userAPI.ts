import {GetUserDto, IdType} from "@evergarden/shared";
import api from "../../utils/api";
import Logger from "js-logger";

export async function pingUser(id: IdType): Promise<GetUserDto | null> {
  try {
    const response = await api.get(`/api/users/ping/${id}`);
    return response.data;
  } catch (error) {
    Logger.error(error);
    return null;
  }
}
