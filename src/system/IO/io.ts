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