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
