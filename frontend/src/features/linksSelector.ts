import { RootStore } from "../Store";

export const getAllLinks = (state: RootStore) => state.links.data.all;
