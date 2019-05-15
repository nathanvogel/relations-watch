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

export function selectiveExtract<
  T extends Object,
  P extends Extract<keyof T, string>
>(e2: T, overridingPropNames: P[]): any {
  const overrider: { [key: string]: any } = {};
  for (let p of overridingPropNames) {
    overrider[p] = e2[p];
  }
  return overrider;
}

export function selectiveDiff<
  T extends Object,
  P extends Extract<keyof T, string>
>(e1: T, e2: T, overridingPropNames: P[]): boolean {
  for (let p of overridingPropNames) {
    if (e1[p] !== e2[p]) return true;
  }
  return false;
}
