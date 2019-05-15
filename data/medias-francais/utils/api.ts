import axios, { AxiosResponse } from "axios";
import C from "./constants";

const api = axios.create({
  baseURL: C.DEV ? "http://127.0.0.1:8529/_db/_system/api1" : "", // local dev
  // baseURL: "https://diploman.westeurope.cloudapp.azure.com/api1", // Azure VM
  headers: {}
});

export function getResponseData(response: AxiosResponse): any {
  if (response.status !== 200) {
    console.error("Error in response " + response.status);
    console.log(response.data);
    throw new Error("Error:" + response.status + ": " + response.statusText);
  }
  return response.data;
}

export default api;
