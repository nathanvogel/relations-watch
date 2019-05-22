import { AxiosResponse } from "axios";
import wd, {
  Entity as WDEntity,
  SearchResult as WDSearchResult,
} from "wikidata-sdk";
import { Dictionary as WDDictionary } from "wikidata-sdk/types/helper";

export type WDResponseData = {
  success?: number;
  entities?: WDDictionary<WDEntity>;
  search?: WDSearchResult[];
  warnings?: any;
};

export async function checkAxiosResponse(response: AxiosResponse) {
  if (response.status !== 200) {
    console.error("Error in response:");
    console.error(response.data);
    throw new Error(response.statusText);
  }
  return response.data;
}

export async function checkWDData(data: WDResponseData) {
  if (data.success !== 1) {
    console.error("Wikidata response success check failed: " + data.success);
    console.log(data);
    throw new Error("Wikidata didn't indicate a sucessful response.");
  }
  if (data.warnings) {
    console.warn("Wikidata returned warnings!");
    console.warn(data.warnings);
  }
  return data;
}

// export async function checkWDEntityData(data: WDResponseData) {
//   await checkWDData(data);
//   return data.entities;
// }
