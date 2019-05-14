"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_extra_1 = __importDefault(require("fs-extra"));
var csv_parse_1 = __importDefault(require("csv-parse"));
var types_1 = require("./utils/types");
// Code sharing at its finest.
// import { Entity, EntityType } from "../../frontend/src/utils/types";
var FILENAME = "Medias_francais/medias_francais.tsv";
var dataset = [];
var recordToEntity = function (record) {
    return {
        type: record.typeLibelle === "Personne physique"
            ? types_1.EntityType.Human
            : types_1.EntityType.MoralPerson,
        name: record.nom,
        ds: {
            mfn: record.nom,
            mfid: record.id
        }
    };
};
var stream = fs_extra_1.default
    .createReadStream(FILENAME)
    .pipe(csv_parse_1.default({
    columns: true,
    delimiter: "\t",
    skip_lines_with_empty_values: true,
    skip_empty_lines: true
}))
    .on("data", function (record) {
    try {
        dataset.push(recordToEntity(record));
        // console.log(dataset.length, " => ", record);
    }
    catch (err) {
        console.error("Error while parsing file:", err);
    }
});
var loadMediasFrancaisEntities = new Promise(function (resolve, reject) {
    stream
        .on("end", function () {
        console.log("Done reading:", FILENAME);
        resolve(dataset);
    })
        .on("error", reject);
});
exports.default = loadMediasFrancaisEntities;
