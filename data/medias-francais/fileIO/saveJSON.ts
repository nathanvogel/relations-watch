import fs from "fs-extra";
import { dirname as getDirName } from "path";

async function ensureDir(directory: string) {
  try {
    await fs.ensureDir(directory);
  } catch (err) {
    console.error("Couldn't create dir " + directory, err);
  }
}

async function mkdirAndWriteFile(path: string, contents: string) {
  await ensureDir(getDirName(path));
  await fs.writeFile(path, contents);
}

async function saveJSON(filename: string, data: any) {
  var output = JSON.stringify(data, null, 2);
  try {
    await mkdirAndWriteFile(filename, output);
    console.log(filename + " saved.");
  } catch (err) {
    throw err;
  }
}

export default saveJSON;
