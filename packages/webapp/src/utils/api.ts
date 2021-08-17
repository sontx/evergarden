import axios, { AxiosError } from "axios";
import { Alert } from "rsuite";

const api = axios.create({});

export function handleRequestError(error: AxiosError): string {
  if (error.response) {
    return error.response.data?.message
      ? error.response?.data?.message
      : error.message;
  }

  if (error.request) {
    return "The request was made but no response was received";
  }

  return error.message;
}

export async function catchRequestError<T>(
  doRequest: () => Promise<T>,
  rejectWithValue?: (value: any) => any,
  showErrorUi?: boolean,
): Promise<T | undefined> {
  try {
    return await doRequest();
  } catch (e: any) {
    const error = handleRequestError(e);
    if (showErrorUi) {
      Alert.warning(error, 5000);
    }
    if (rejectWithValue) {
      return rejectWithValue(error);
    }
    return undefined;
  }
}

export default api;
