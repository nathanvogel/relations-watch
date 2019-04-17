import axios, { AxiosResponse, AxiosError } from "axios";
import { ErrorPayload } from "./types";

const api = axios.create({
  baseURL: "http://127.0.0.1:8529/_db/_system/api1",
  headers: {}
});

export function checkResponse(response: AxiosResponse): ErrorPayload | null {
  if (response.status !== 200) {
    console.error("Error in response " + response.status);
    console.log(response);
    return {
      eData: response.data,
      eMessage: response.statusText,
      eStatus: response.status
    };
  }
  return null;
}

export function checkError(error: AxiosError): ErrorPayload {
  if (error.response) {
    return {
      eData: error.response.data,
      eMessage: error.response.statusText,
      eStatus: error.response.status
    };
  } else {
    console.error(error);
    return {
      eData: error,
      eMessage: error.message,
      eStatus: error.code ? error.code : "UNKNOWN"
    };
  }
}

export default api;
