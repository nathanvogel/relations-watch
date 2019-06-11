import update from "immutability-helper";

import {
  EdgePreview,
  Edge,
  CommonEdge,
  Status,
  Entity,
  EntityPreview,
  ErrorPayload,
  DatasetId,
  LinkDir,
  V4IndicatorDatum,
  V4LinkDatum,
  RelationType,
  FamilialLink,
} from "./types";
import CONSTS, { DirectedFamilialLinks } from "./consts";
import { DirectedLinks } from "./consts";
import { RootStore } from "../Store";

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
 * @return             A new edge object, for convenience
 */
export function getSimplifiedEdge<E extends CommonEdge>(edge: E): E {
  const newEdge = update<CommonEdge>(edge, {
    $merge: {
      _from: edge._from.replace("entities/", ""),
      _to: edge._to.replace("entities/", ""),
    },
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
    type: edge.type,
    fType: edge.fType,
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

/**
 * From a react-router parameter, returns either a real key or an empty string
 * (because empty strings can be used to get an undefined element from an
 * object like a part of a redux stom)
 * @param  key the param, which might be falsy, a real key, or the Empty Key
 *             constant
 * @return     an empty string or the given non-empty truthy string
 */
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

/**
 * Converts an array of objects to an object indexed with the given
 * property name belonging the type of the objects in the given array.
 */
export function getKeyObject<T, P extends Extract<keyof T, string>>(
  array: T[],
  keyPropName: P
): { [key: string]: T } {
  const list: { [key: string]: T } = {};
  for (let element of array) {
    const key = (element[keyPropName] as unknown) as string;
    if (key) list[key] = element;
  }
  return list;
}

interface DatasetObject {
  ds?: { [key in DatasetId]?: string };
}

export function getDsKeyObject<T extends DatasetObject>(
  array: T[],
  keyPropName: DatasetId
): { [key: string]: T } {
  const list: { [key: string]: T } = {};
  for (let element of array) {
    if (!element.ds)
      throw new Error("Missing .ds prop in element " + JSON.stringify(element));
    const key = (element.ds[keyPropName] as unknown) as string;
    if (key) list[key] = element;
  }
  return list;
}

/**
 * [filter description]
 * @param  onlyUnique [description]
 * @return            [description]
 */
export function objectFromArray(array: string[]): { [key: string]: boolean } {
  const obj: { [key: string]: boolean } = {};
  for (let e of array) if (e) obj[e] = true;
  return obj;
}

/**
 * Filter out duplicate elements in an Array.
 */
export function arrayWithoutDuplicates<T>(array: T[]): T[] {
  return array.filter(onlyUnique);
}

function onlyUnique(value: any, index: number, self: any[]) {
  return self.indexOf(value) === index;
}

export function getEntityPreview(entity: Entity): EntityPreview {
  return {
    _key: entity._key as string,
    name: entity.name,
    type: entity.type,
    imageId: entity.imageId,
    text: entity.text,
  };
}

export function getEntityPreviewFromState(
  key: string,
  state: RootStore
): EntityPreview | undefined {
  if (state.entities.datapreview[key]) return state.entities.datapreview[key];
  else if (state.entities.data[key])
    return getEntityPreview(state.entities.data[key]);
  return undefined;
}

/**
 * Quick and dirty ErrorPayload factory to passin any caught error.
 */
export const errToErrorPayload: (err: any) => ErrorPayload = (err: any) => ({
  eData: err,
  eMessage: err && err.message ? err.message : "Unknown error!",
  eStatus: err ? err.code : "UNKOWN",
});

/**
 * Check if obj contains at least one enumerable property.
 * @param  obj the object to check
 * @return     true if there're no properties, false otherwise.
 */
export function isEmptyObject(obj: Object): boolean {
  for (var prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      return false;
    }
  }
  return true;
}

/**
 * Compute a new LinkDirection (like the logical AND, which would be faster,
 * but we have enums here, so might as well stick to them.)
 */
export function getNewDirection(
  currentDir: LinkDir,
  newDir: LinkDir.Invert | LinkDir.Normal
): LinkDir {
  if (currentDir === LinkDir.Normal && newDir === LinkDir.Invert)
    return LinkDir.Both;
  if (currentDir === LinkDir.Invert && newDir === LinkDir.Normal)
    return LinkDir.Both;
  if (currentDir === LinkDir.Both) return LinkDir.Both;
  return newDir;
}

/**
 * Constructor for the IndicatorDatum
 * @param  relation     base relation
 * @param  relationType type of the relation
 * @param  direction    direction of the edge
 * @param  offsetIndex  the number of existing indicators on this side.
 * @return              a new V4IndicatorDatum
 */
export function createIndicatorDatum(
  relation: V4LinkDatum,
  relationType: RelationType,
  direction: LinkDir.Normal | LinkDir.Invert,
  offsetIndex: number
): V4IndicatorDatum {
  return {
    fromKey:
      direction === LinkDir.Normal ? relation.sourceKey : relation.targetKey,
    toKey:
      direction === LinkDir.Normal ? relation.targetKey : relation.sourceKey,
    relationId: relation.relationId,
    indicatorId:
      relation.relationId +
      "_" +
      relationType.toString() +
      "_" +
      direction.toString(),
    withType: relation.withType,
    type: relationType,
    direction,
    offsetIndex,
  };
}

/**
 * Returns true if the given type has a precise direction (sens).
 */
export function isDirectedType(t: RelationType, ft: FamilialLink | undefined) {
  if (t === RelationType.Family) return isDirectedFamilialType(ft);
  return DirectedLinks.indexOf(t) >= 0;
}

/**
 * Returns true if the given familial link type has a precise direction (sens).
 */
export function isDirectedFamilialType(t: FamilialLink | undefined) {
  // '==' checks for undefined and null.
  if (t == null) return false;
  return DirectedFamilialLinks.indexOf(t) >= 0;
}

export function withoutHttps(url: string): string {
  return url.replace(/^https?:\/\//, "");
}
