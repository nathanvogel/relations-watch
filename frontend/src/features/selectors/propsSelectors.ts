import { RootStore } from "../../Store";

interface Props1 {
  entityKey: string;
}
export const getEntityKey = (_: RootStore, props: Props1) => props.entityKey;

interface Props2 {
  entityKeys: string[];
}
export const getEntityKeys = (_: RootStore, props: Props2) => props.entityKeys;
