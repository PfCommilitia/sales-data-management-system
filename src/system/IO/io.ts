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

export function loadLocalization(key: string) {
  return getJson(convertPath(`localization.json`), key) ?? key;
}

export function saveLocalization(key: string, value: string) {
  setJson(convertPath(`localization.json`), key, value);
}

export function loadJson(path: string): Record<string, any> {
  try {
    return JSON.parse(Fs.readFileSync(path, "utf-8"));
  } catch(err) {
    return {};
  }
}

export function getJson(path: string, key: string) {
  return loadJson(path)[key];
}

export function saveJson(path: string, json: Record<string, any>) {
  Fs.writeFileSync(path, JSON.stringify(json));
}

export function setJson(path: string, key: string, value: any) {
  const json = loadJson(path);
  json[key] = value;
  saveJson(path, json);
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

export const json = {
  load: loadJson,
  get: getJson,
  save: saveJson,
  set: setJson
};