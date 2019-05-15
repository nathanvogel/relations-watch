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

type DatasetObject = {
  ds?: { [key in DatasetId]: string };
};

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
