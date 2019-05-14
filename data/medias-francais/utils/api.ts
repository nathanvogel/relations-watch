import axios, { AxiosResponse } from "axios";
import C from "./constants";

const api = axios.create({
  baseURL: C.DEV ? "http://127.0.0.1:8529/_db/_system/api1" : "", // local dev
  // baseURL: "https://diploman.westeurope.cloudapp.azure.com/api1", // Azure VM
  headers: {}
});

export function checkResponse(response: AxiosResponse) {
  if (response.status !== 200) {
    console.error("Error in response " + response.status);
    console.log(response.data);
    return new Error("Error:" + response.status + ": " + response.statusText);
  }
  return null;
}

export default api;
