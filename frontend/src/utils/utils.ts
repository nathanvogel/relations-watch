import { EdgePreview, Edge, CommonEdge } from "./types";

// CONVENTION:
// - relationId is the alphabetically sorted combination of both entities
// - edgeKey is the _key of this relation in the database.

/**
 * Generates the alphabetically sorted combination of both entities
 * It is only for local use in Redux, not communication with the server!
 * @param  entity1Key Key 1
 * @param  entity2Key Key 2
 * @return
 */
export function getRelationId(
  entity1Key?: string,
  entity2Key?: string
): string | null {
  return entity1Key && entity2Key
    ? entity1Key > entity2Key
      ? entity1Key + "_" + entity2Key
      : entity2Key + "_" + entity1Key
    : null;
}

/**
 * Mutate the Edge or EdgePreview to remove collection names.
 * @param  edge        The edge to be mutated.
 * @return             A ref to the same edge object, for convienience
 */
export function simplifyEdge<E extends CommonEdge>(edge: E): E {
  edge._from = edge._from.replace("entities/", "");
  edge._to = edge._to.replace("entities/", "");
  return edge;
}

export function getEdgePreview(edge: Edge): EdgePreview {
  if (!edge._key)
    throw new Error("Edge doesn't have a key. Can't create EdgePreview");
  return {
    _key: edge._key,
    _from: edge._from,
    _to: edge._to,
    type: edge.type
  };
}
