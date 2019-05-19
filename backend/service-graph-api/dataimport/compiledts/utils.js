"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Converts an array of objects to an object indexed with the given
 * property name belonging the type of the objects in the given array.
 */
function getKeyObject(array, keyPropName) {
    var list = {};
    for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
        var element = array_1[_i];
        var key = element[keyPropName];
        if (key)
            list[key] = element;
    }
    return list;
}
exports.getKeyObject = getKeyObject;
/**
 * Get the dataset ID of the entity, throw if it's absent.
 * @param  elements  the element to search in
 * @param  elements  The ID of the dataset
 * @return           The element ID in element.ds[ID]
 */
function getElementDatasetId(element, datasetId) {
    // Make sure we have access to the element ID in this dataset.
    if (!element.ds || !element.ds[datasetId])
        throw new Error("The dataset loader didn't include the .ds object.");
    return element.ds[datasetId];
}
exports.getElementDatasetId = getElementDatasetId;
function getDsKeyObject(array, keyPropName) {
    var list = {};
    for (var _i = 0, array_2 = array; _i < array_2.length; _i++) {
        var element = array_2[_i];
        if (!element.ds)
            throw new Error("Missing .ds prop in element " + JSON.stringify(element));
        var key = element.ds[keyPropName];
        if (key)
            list[key] = element;
    }
    return list;
}
exports.getDsKeyObject = getDsKeyObject;
function selectiveExtract(e2, overridingPropNames) {
    var overrider = {};
    for (var _i = 0, overridingPropNames_1 = overridingPropNames; _i < overridingPropNames_1.length; _i++) {
        var p = overridingPropNames_1[_i];
        overrider[p] = e2[p];
    }
    return overrider;
}
exports.selectiveExtract = selectiveExtract;
function selectiveDiff(e1, e2, overridingPropNames) {
    for (var _i = 0, overridingPropNames_2 = overridingPropNames; _i < overridingPropNames_2.length; _i++) {
        var p = overridingPropNames_2[_i];
        if (e1[p] !== e2[p])
            return true;
    }
    return false;
}
exports.selectiveDiff = selectiveDiff;
