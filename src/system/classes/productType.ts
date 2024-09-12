import { Opt } from "./opt";
import * as Fs from "fs";
import { convertPath, loadAll, meta } from "../IO/io";

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

  public static generate(internalName: string): ProductType {
    const productType = new ProductType(
      { id: meta.lastProductTypeId, internalName }
    );
    meta.lastProductTypeId += 1;
    productType.writeToFile(true);
    ProductType.loaded.push(productType);
    ProductType.index[productType.toInternalName()] = productType;
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

  public writeToFile(updateIndex: boolean): void {
    Fs.writeFileSync(
      convertPath(`productTypes/${ this.id }.json`), this.toJson()
    );
    if (updateIndex) {
      Fs.writeFileSync(
        convertPath(`productTypesIndex.json`),
        JSON.stringify(ProductType.index)
      );
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

  public set(arg: Partial<this>): void {
    Object.assign(this, arg);
    this.writeToFile(false);
  }

  public static async loadProductTypes(): Promise<void> {
    ProductType.loaded = await loadAll(
      "productTypes", isProductTypeSource,
      obj => new ProductType(obj as ProductTypeSource)
    );
    try {
      ProductType.index = JSON.parse(
        Fs.readFileSync(convertPath(`productTypesIndex.json`), "utf-8")
      );
    } catch (err) {
      ProductType.index = {};
    }
  }
}

export default ProductType;