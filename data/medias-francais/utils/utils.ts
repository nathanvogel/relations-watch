import { DatasetId } from "./types";

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

/**
 * Get the dataset ID of the entity, throw if it's absent.
 * @param  elements  the element to search in
 * @param  elements  The ID of the dataset
 * @return           The element ID in element.ds[ID]
 */
export function getElementDatasetId(
  element: DatasetObject,
  datasetId: DatasetId
) {
  // Make sure we have access to the element ID in this dataset.
  if (!element.ds || !element.ds[datasetId])
    throw new Error("The dataset loader didn't include the proper origin ID.");
  return element.ds[datasetId];
}

interface DatasetObject {
  ds?: { [key in DatasetId]: string };
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

export function selectiveExtract<T extends Object, P extends keyof T>(
  e2: T,
  overridingPropNames: P[]
): any {
  const overrider: { [key: string]: any } = {};
  for (let p of overridingPropNames) {
    overrider[p as string] = e2[p];
  }
  return overrider;
}

export function selectiveDiff<T extends Object, P extends keyof T>(
  e1: T,
  e2: T,
  overridingPropNames: P[]
): boolean {
  for (let p of overridingPropNames) {
    if (e1[p] !== e2[p]) return true;
  }
  return false;
}
