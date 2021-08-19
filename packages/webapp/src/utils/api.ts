import axios, { AxiosError } from "axios";
import { Alert } from "rsuite";
import React from "react";
import { globalIntl } from "../components/HttpError";

const api = axios.create({});

export interface RequestError {
  message: string;
  code?: number;
  prettierMessage?: string;
}

export function handleRequestError(error: AxiosError): RequestError {
  if (error.response) {
    return {
      message: error.response.data?.message
        ? error.response?.data?.message
        : error.message,
      code: error.response.status,
    };
  }

  if (error.request) {
    return { message: "The request was made but no response was received" };
  }

  return {
    message: error.message,
  };
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
    let prettierMessage;
    if (error.message === "Not Found" && error.code === 404) {
      prettierMessage = globalIntl.formatMessage({ id: "error404" });
    } else if (error.message === "Forbidden" && error.code === 403) {
      prettierMessage = globalIntl.formatMessage({ id: "error403" });
    } else if (error.code === 500) {
      prettierMessage = globalIntl.formatMessage({ id: "error500" });
    } else {
      prettierMessage = error.message;
    }
    if (showErrorUi) {
      Alert.warning(prettierMessage, 5000);
    }
    if (rejectWithValue) {
      return rejectWithValue({ ...error, prettierMessage });
    }
    return undefined;
  }
}

export default api;
