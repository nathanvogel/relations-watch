"use strict";
// const logConsistencyError = (e1: Entity, e2: Entity, propName: string) => {
//   console.warn(
//     `${e1.name} isn't consistent with ${e2.name} on prop ${propName}!"`
//   );
//   console.warn(e1, e2);
// };
//
// /**
//  * Detects unsolvable conflicts between entities.
//  */
// const areConsistent = (dbEntity: Entity, entity: Entity): boolean => {
//   var noConflictFound = true;
//   if (dbEntity.type !== entity.type) {
//     logConsistencyError(dbEntity, entity, "type");
//     noConflictFound = false;
//   }
//   return noConflictFound;
// };
Object.defineProperty(exports, "__esModule", { value: true });
function logConsistencyError(t1, t2, propName) {
    console.warn("Prop " + propName + ": " + t1[propName] + " isn't consistent with " + t2[propName]);
    console.warn(t1, t2);
}
/**
 * Detects unsolvable conflicts between entities.
 */
function areConsistent(dbT, t, propNames) {
    var noConflictFound = true;
    for (var _i = 0, propNames_1 = propNames; _i < propNames_1.length; _i++) {
        var prop = propNames_1[_i];
        if (dbT[prop] !== t[prop]) {
            logConsistencyError(dbT, t, prop);
            noConflictFound = false;
        }
    }
    return noConflictFound;
}
exports.areConsistent = areConsistent;
