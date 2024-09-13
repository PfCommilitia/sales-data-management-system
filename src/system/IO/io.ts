import * as Path from "path";
import * as Fs from "node:fs";
import { initAll } from "../classes/init";

const dirs = [
  "modifiers",
  "operators",
  "products",
  "productTypes"
];

let basePath = "";

export let meta = {} as Record<string, any>;

export let localization = {} as Record<string, any>;

export function setBasePath(path: string): void {
  basePath = path;
}

export function getBasePath(): string {
  return basePath;
}

export function convertPath(suffix: string): string {
  return Path.join(basePath, suffix);
}

export async function initPath(): Promise<void> {
  await Promise.all(
    dirs.map(convertPath).filter(dir => !Fs.existsSync(dir)).map(
      dir => Fs.promises.mkdir(dir, { recursive: true })
    )
  );
  if (!Fs.existsSync(convertPath("meta.json"))) {
    meta = {
      lastModifierId: 0,
      lastOperatorId: 0,
      lastProductId: 0,
      lastProductTypeId: 0
    }
    await saveJson(convertPath("meta.json"), meta);
  } else {
    await loadMeta();
  }
  await initAll();
}

export async function loadMeta(): Promise<void> {
  const metaSource = await loadJson(convertPath("meta.json"));
  meta.lastModifierId = metaSource.lastModifierId;
  meta.lastOperatorId = metaSource.lastOperatorId;
  meta.lastProductId = metaSource.lastProductId;
  meta.lastProductTypeId = metaSource.lastProductTypeId;
}

export async function loadAll<T>(
  path: string,
  filter: (arg: Record<string, any>) => boolean
    = (_obj: Record<string, any>) => true,
  process: (arg: Record<string, any>) => T
    = (obj: Record<string, any>) => obj as T
): Promise<T[]> {
  return (
    await Promise.all(
      (
        await Fs.promises.readdir(convertPath(path))
      ).map(
        async file => {
          const obj = await loadJson(convertPath(`${ path }/${ file }`));
          if (filter(obj)) {
            return process(obj);
          }
          return null;
        }
      )
    )
  ).filter(obj => obj !== null) as unknown as T[];
}

export function getLocalization(key: string): string {
  return (
    typeof localization[key] === "string" && localization[key]
  ) || key;
}

export async function loadLocalization(): Promise<void> {
  localization = await loadJson(convertPath(`localization.json`));
}

export async function saveLocalization(
  key: string,
  value: string
): Promise<void> {
  await setJson(convertPath(`localization.json`), key, value);
}

export async function loadJson(path: string): Promise<Record<string, any>> {
  try {
    return JSON.parse(await Fs.promises.readFile(path, "utf-8"));
  } catch (err) {
    return {};
  }
}

export async function getJson(
  path: string,
  key: string
): Promise<Record<string, any> | undefined> {
  return (
    await loadJson(path)
  )[key];
}

export async function saveJson(
  path: string,
  json: Record<string, any>
): Promise<void> {
  await Fs.promises.writeFile(path, JSON.stringify(json));
}

export async function setJson(
  path: string,
  key: string,
  value: any
): Promise<void> {
  const json = await loadJson(path);
  json[key] = value;
  await saveJson(path, json);
}

export const locale = {
  load: loadLocalization,
  save: saveLocalization,
  get: getLocalization
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