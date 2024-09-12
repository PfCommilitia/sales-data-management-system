import * as Path from "path";
import * as Fs from "node:fs";

const dirs = [
  "modifiers",
  "operators",
  "products",
  "productTypes"
];

let basePath = "";

export const meta = {} as Record<string, any>;

export function setBasePath(path: string) {
  basePath = path;
}

export function getBasePath() {
  return basePath;
}

export function convertPath(suffix: string) {
  return Path.join(basePath, suffix);
}

export async function initPath(): Promise<void> {
  await Promise.all(dirs.map(convertPath).filter(dir => !Fs.existsSync(dir)).map(
    dir => Fs.promises.mkdir(dir, { recursive: true })
  ));
  if (!Fs.existsSync(convertPath("meta.json"))) {
    Fs.writeFileSync(convertPath("meta.json"), JSON.stringify({
      lastModifierId: 0,
      lastOperatorId: 0,
      lastProductId: 0,
      lastProductTypeId: 0
    }));
  }
}

(
  () => {
    const metaSource = JSON.parse(Fs.readFileSync(convertPath("meta.json"), "utf-8"));
    meta.lastModifierId = metaSource.lastModifierId;
    meta.lastOperatorId = metaSource.lastOperatorId;
    meta.lastProductId = metaSource.lastProductId;
    meta.lastProductTypeId = metaSource.lastProductTypeId;
  }
)();

export async function loadAll<T>(
  path: string,
  filter: (arg: T) => boolean = (_obj: Record<string, any>) => true,
  process: (arg: Record<string, any>) => T = (obj: Record<string, any>) => obj as T
): Promise<T[]> {
  return await (
    async () => (
      await Promise.all(
        Fs.readdirSync(convertPath(path)).map(
          file => async () => {
            const obj = JSON.parse(
              await Fs.promises.readFile(convertPath(`${ path }/${ file }`), "utf-8")
            );
            if (filter(obj)) {
              return process(obj);
            }
            return null;
          }
        )
      )
    ).filter(obj => obj !== null) as unknown as T[]
  )();
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
  } catch (err) {
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