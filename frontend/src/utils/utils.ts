import update from "immutability-helper";

import { EdgePreview, Edge, CommonEdge, Status } from "./types";
import CONSTS from "./consts";

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

interface IHasFoo {
  foo: string;
}
interface IHasBar {
  bar?: number;
}
update<IHasFoo & IHasBar>({ foo: "FOO" }, { $merge: { bar: 42 } });

/**
 * Convert the Edge or EdgePreview to remove collection names.
 * @param  edge        The edge to be copied and processed
 * @return             A new edge object, for convienience
 */
export function getSimplifiedEdge<E extends CommonEdge>(edge: E): E {
  const newEdge = update<CommonEdge>(edge, {
    $merge: {
      _from: edge._from.replace("entities/", ""),
      _to: edge._to.replace("entities/", "")
    }
  });
  return newEdge as E;
}

/**
 * Convert an array of edges to remove the collection names from _form and _to
 * @param  serverEdges [description]
 * @return             [description]
 */
export function getSimplifiedEdges(serverEdges: Array<Edge>) {
  const relation: Array<Edge> = [];
  for (let e of serverEdges) {
    relation.push(getSimplifiedEdge(e));
  }
  return relation;
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

/**
 * Given a Status, determines if the data should be requested (again).
 * This is intended for use in componentDidMount().
 * @param  status The current status
 * @return        boolean indicating wether to load
 */
export function shouldLoad(status: Status | undefined | null) {
  return Boolean(!status || status === Status.Error);
}

export function emptyOrRealKey(key?: string): string {
  if (key === CONSTS.EMPTY_KEY) return "";
  else if (key) return key;
  else return "";
}

export function keyForUrl(key?: string): string {
  return key || CONSTS.EMPTY_KEY;
}

/**
 * Makes sure we're working with an array, in case we got a single object.
 * (when working with ReactSelect ValueType for example).
 */
export function getArray<T>(arg: T | T[]): T[] {
  return arg instanceof Array ? arg : [arg];
}
