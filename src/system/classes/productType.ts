import { Opt } from "./opt";
import * as Fs from "fs";
import {
  convertPath,
  loadAll,
  loadJson,
  meta,
  saveJson,
  saveMeta
} from "../IO/io";

interface ProductTypeSource {
  id: number;
  internalName: string;
}

function isProductTypeSource(obj: Record<string, any>): boolean {
  return typeof obj.id === "number" &&
    typeof obj.internalName === "string";
}

export class ProductType {
  public static loaded: ProductType[] = [];
  public static index: Record<string, ProductType> = {};
  public id: number;
  public internalName: string;

  public constructor(fromObject: ProductTypeSource) {
    this.id = fromObject.id;
    this.internalName = fromObject.internalName;
  }

  public static async generate(internalName: string): Promise<ProductType> {
    const productType = new ProductType(
      { id: meta.lastProductTypeId, internalName }
    );
    meta.lastProductTypeId += 1;
    await saveMeta();
    ProductType.loaded.push(productType);
    ProductType.index[productType.toInternalName()] = productType;
    await productType.writeToFile(true);
    return productType;
  }

  public static fromJson(json: string): ProductType {
    return new ProductType(JSON.parse(json));
  }

  public toJson(): string {
    return JSON.stringify({
      id: this.toNumber(),
      internalName: this.toInternalName()
    } as ProductTypeSource);
  }

  public static fromNumber(id: number): Opt<ProductType> {
    return Opt.create(ProductType.loaded[id]);
  }

  public async writeToFile(updateIndex: boolean): Promise<void> {
    await Fs.promises.writeFile(
      convertPath(`productTypes/${ this.id }.json`),
      this.toJson()
    );
    if (updateIndex) {
      const indexNumber: Record<string, number> = {};
      for (const name in ProductType.index) {
        const obj = ProductType.index[name];
        indexNumber[name] = obj.toNumber();
      }
      await saveJson(convertPath(`productTypesIndex.json`), indexNumber);
    }
  }

  public toNumber(): number {
    return this.id;
  }

  public static fromInternalName(name: string): Opt<ProductType> {
    return Opt.create(ProductType.index[name]);
  }

  public toInternalName(): string {
    return this.internalName;
  }

  public async set(arg: Partial<this>): Promise<void> {
    Object.assign(this, arg);
    await this.writeToFile(false);
  }

  public static async loadProductTypes(): Promise<void> {
    ProductType.loaded = await loadAll(
      "productTypes", isProductTypeSource,
      obj => new ProductType(obj as ProductTypeSource)
    );
    const indexRaw = await loadJson(convertPath("productTypesIndex.json"));
    ProductType.index = {};
    for (const name in indexRaw) {
      ProductType.index[name] = ProductType.fromNumber(indexRaw[name]).unwrap();
    }
  }
}

export default ProductType;