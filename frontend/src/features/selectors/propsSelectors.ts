import { RootStore } from "../../Store";

interface Props1 {
  entityKey: string;
}
export const getEntityKey = (_: RootStore, props: Props1) => props.entityKey;

interface Props2 {
  entityKeys: string[];
}
export const getEntityKeys = (_: RootStore, props: Props2) => props.entityKeys;

interface Props3 {
  entity1Key?: string;
  sourceKey?: string;
}
export const getEntity1Key = (_: RootStore, props: Props3) =>
  props.entity1Key || props.sourceKey || "";
interface Props3 {
  entity2Key?: string;
  targetKey?: string;
}
export const getEntity2Key = (_: RootStore, props: Props3) =>
  props.entity2Key || props.targetKey || "";
