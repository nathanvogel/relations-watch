"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_extra_1 = __importDefault(require("fs-extra"));
var csv_parse_1 = __importDefault(require("csv-parse"));
var types_1 = require("./utils/types");
var FILENAME_ENTITIES = "Medias_francais/medias_francais.tsv";
var FILENAME_RELATIONS = "Medias_francais/relations_medias_francais.tsv";
var mfParserOptions = {
    columns: true,
    delimiter: "\t",
    skip_lines_with_empty_values: true,
    skip_empty_lines: true
};
function getMFEdgeId(id1, id2) {
    return id1 > id2 ? id1 + "_" + id2 : id2 + "_" + id1;
}
exports.getMFEdgeId = getMFEdgeId;
function getMFEdgeName(record) {
    var id1 = record.origine.toLowerCase();
    var id2 = record.cible.toLowerCase();
    return id1 > id2 ? id1 + "_" + id2 : id2 + "_" + id1;
}
function typeLibelleToType(t) {
    switch (t.trim()) {
        case "Personne physique":
            return types_1.EntityType.Human;
        case "Personne morale":
            return types_1.EntityType.MoralPerson;
        case "Média":
            return types_1.EntityType.Media;
        case "État":
            return types_1.EntityType.State;
        default:
            throw new Error("Unknown typeLibelle:" + t);
    }
}
var recordToEntity = function (record) {
    return {
        type: typeLibelleToType(record.typeLibelle),
        name: record.nom,
        ds: {
            mfn: record.nom.toLowerCase(),
            mfid: record.id
        }
    };
};
exports.loadMediasFrancaisEntities = function () {
    return new Promise(function (resolve, reject) {
        var dataset = [];
        fs_extra_1.default.createReadStream(FILENAME_ENTITIES)
            .pipe(csv_parse_1.default(mfParserOptions))
            .on("data", function (record) {
            if (record.id === "146") {
                console.log("Ignoring manually deduplicated id");
                return;
            }
            try {
                // console.log(dataset.length, " => ", record);
                dataset.push(recordToEntity(record));
            }
            catch (err) {
                console.error("Error while parsing file:", err);
            }
        })
            .on("end", function () {
            console.log("Done reading:", FILENAME_ENTITIES);
            resolve(dataset);
        })
            .on("error", reject);
    });
};
var yo = {};
function addYo(key) {
    if (yo[key])
        yo[key]++;
    else
        yo[key] = 1;
}
var recordToEdge = function (record, dbEntities) {
    var type = types_1.RelationType.IsOwned;
    var owned = 100;
    var origineId = record.id;
    var cibleId = null;
    // Find the cible ID, because it's missing in the current state of
    // the relations_media_francais.tsv file.
    for (var key in dbEntities) {
        var entity = dbEntities[key];
        if (entity.name === record.cible) {
            if (!entity.ds || !entity.ds.mfid)
                throw new Error("missing mfid on " + entity.name + " - " + entity._key);
            cibleId = entity.ds.mfid;
            break;
        }
    }
    if (!cibleId)
        throw new Error("Unable to find cible " + record.cible + " in dbEntities");
    // Safe to cast, the server would refuse the write anyway.
    var origineKey = dbEntities[origineId]._key;
    var cibleKey = dbEntities[cibleId]._key;
    var edgeMfid = getMFEdgeId(origineId, cibleId);
    var edgeMfn = getMFEdgeName(record);
    return {
        _from: origineKey,
        _to: cibleKey,
        type: type,
        text: "",
        owned: owned,
        sources: [],
        ds: {
            mfid: edgeMfid,
            mfn: edgeMfn
        }
    };
};
exports.loadMediasFrancaisRelations = function (dbEntities) {
    return new Promise(function (resolve, reject) {
        var dataset = [];
        var stream = fs_extra_1.default
            .createReadStream(FILENAME_RELATIONS)
            .pipe(csv_parse_1.default(mfParserOptions))
            .on("data", function (record) {
            try {
                var edge = recordToEdge(record, dbEntities);
                addYo(record.origine);
                addYo(record.cible);
                if (edge)
                    dataset.push(edge);
                // console.log(dataset.length, " => ", record);
            }
            catch (err) {
                console.error("Error while converting edge:", record);
                console.error(err);
                stream.end();
            }
        })
            .on("end", function () {
            console.log("Done reading:", FILENAME_RELATIONS);
            console.log("===========================");
            console.log("===========================");
            console.log("===========================");
            console.log(yo);
            console.log("===========================");
            console.log("===========================");
            console.log("===========================");
            resolve(dataset);
        })
            .on("error", reject);
    });
};
