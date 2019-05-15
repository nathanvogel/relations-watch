"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var constants_1 = __importDefault(require("./constants"));
var api = axios_1.default.create({
    baseURL: constants_1.default.DEV ? "http://127.0.0.1:8529/_db/_system/api1" : "",
    // baseURL: "https://diploman.westeurope.cloudapp.azure.com/api1", // Azure VM
    headers: {}
});
function getResponseData(response) {
    if (response.status !== 200) {
        console.error("Error in response " + response.status);
        console.log(response.data);
        throw new Error("Error:" + response.status + ": " + response.statusText);
    }
    return response.data;
}
exports.getResponseData = getResponseData;
exports.default = api;
