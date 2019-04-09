// CONVENTION:
// - relationId is the alphabetically sorted combination of both entities
// - edgeKey is the _key of this relation in the database.
export function getRelationId(
  entity1Key?: string,
  entity2Key?: string
): string | null {
  return entity1Key && entity2Key
    ? entity1Key > entity2Key
      ? entity1Key + entity2Key
      : entity2Key + entity1Key
    : null;
}
