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

function logConsistencyError<T, P extends keyof T>(
  t1: T,
  t2: T,
  propName: P
): void {
  console.warn(
    `Prop ${propName}: ${t1[propName]} isn't consistent with ${t2[propName]}`
  );
  console.warn(t1, t2);
}

/**
 * Detects unsolvable conflicts between entities.
 */
export function areConsistent<T, P extends keyof T>(
  dbT: T,
  t: T,
  propNames: P[]
): boolean {
  var noConflictFound = true;
  for (let prop of propNames) {
    if (dbT[prop] !== t[prop]) {
      logConsistencyError(dbT, t, prop);
      noConflictFound = false;
    }
  }
  return noConflictFound;
}
