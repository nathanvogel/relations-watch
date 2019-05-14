"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var readline_1 = __importDefault(require("readline"));
function askYesNo(query) {
    var rl = readline_1.default.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise(function (resolve) {
        return rl.question(query + " (y/n)", function (ans) {
            rl.close();
            if (ans === "y")
                resolve(true);
            resolve(false);
        });
    });
}
exports.default = askYesNo;
