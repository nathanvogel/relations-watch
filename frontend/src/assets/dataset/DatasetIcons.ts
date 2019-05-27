import wikidataIconS from "./logo-wikidata-mini_32.png";
import { DatasetId } from "../../utils/types";

export const getDatasetSAsset = (type: DatasetId) => {
  switch (type) {
    case DatasetId.Wikidata:
      return wikidataIconS;
    default:
      return "";
  }
};
