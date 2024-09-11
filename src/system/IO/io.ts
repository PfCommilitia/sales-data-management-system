import * as Path from "path";
import * as Fs from "node:fs";

const dirs = [
  "modifiers",
  "operators",
  "products",
  "productTypes"
];

let basePath = "";

export function setBasePath(path: string) {
  basePath = path;
}

export function getBasePath() {
  return basePath;
}

export function convertPath(suffix: string) {
  return Path.join(basePath, suffix);
}

export function initPath() {
  dirs.forEach((dir) => {
    Fs.mkdirSync(convertPath(dir), { recursive: true });
  });
}

function loadLocalization(key: string) {
  try {
    const json = JSON.parse(
      Fs.readFileSync(convertPath(`localization.json`), "utf-8")
    );
    return json[key] ?? key;
  } catch (err) {
    return key;
  }
}

function saveLocalization(key: string, value: string) {
  try {
    const json = JSON.parse(
      Fs.readFileSync(convertPath(`localization.json`), "utf-8")
    );
    json[key] = value;
    Fs.writeFileSync(convertPath(`localization.json`), JSON.stringify(json));
  } catch (err) {
    const json = {} as Record<string, string>;
    json[key] = value;
    Fs.writeFileSync(convertPath(`localization.json`), JSON.stringify(json));
  }
}

export const locale = {
  load: loadLocalization,
  save: saveLocalization
};

export const path = {
  setBase: setBasePath,
  getBase: getBasePath,
  convert: convertPath,
  init: initPath
};