import Strings from "../i18n/en/strings.json";
import { KeyList } from "../utils/types.js";

// Convert the JSON file to a keylist that can autocomplete.
type RType = KeyList<typeof Strings>;
const R: { [key: string]: string } = {};
for (let key in Strings) R[key] = key;

export default R as RType;
