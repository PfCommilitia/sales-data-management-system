import { ProductType } from "./productType";
import { Opt } from "./opt";
import * as Fs from "fs";
import { convertPath, loadAll, loadJson, meta, saveJson } from "../IO/io";

interface ProductSource {
  id: number;
  internalName: string;
  type: number;
  deleted: boolean;
  stock: number;
}

function isProductSource(obj: Record<string, any>): boolean {
  return typeof obj.id === "number" &&
    typeof obj.internalName === "string" &&
    typeof obj.type === "number" &&
    typeof obj.deleted === "boolean" &&
    typeof obj.stock === "number";
}

export class Product {
  public static loaded: Product[] = [];
  public static index: Record<string, Product> = {};
  public id: number;
  public internalName: string;
  public type: ProductType;
  public deleted: boolean;
  public stock: number;

  public constructor(fromObject: ProductSource) {
    this.id = fromObject.id;
    this.internalName = fromObject.internalName;
    this.type = ProductType.fromNumber(fromObject.type).unwrap();
    this.deleted = fromObject.deleted;
    this.stock = fromObject.stock;
  }

  public async generate(
    internalName: string,
    type: ProductType
  ): Promise<Product> {
    const product = new Product({
      id: meta.lastProductId,
      internalName,
      type: type.toNumber(),
      deleted: false,
      stock: 0
    });
    meta.lastProductId += 1;
    await product.writeToFile(true);
    Product.loaded.push(product);
    Product.index[product.toInternalName()] = product;
    return product;
  }

  public static fromJson(json: string): Product {
    return new Product(JSON.parse(json));
  }

  public toJson(): string {
    return JSON.stringify({
      id: this.toNumber(),
      internalName: this.toInternalName(),
      type: this.type.toNumber(),
      deleted: this.deleted,
      stock: this.stock
    } as ProductSource);
  }

  public static fromNumber(id: number): Opt<Product> {
    return Opt.create(Product.loaded[id]);
  }

  public async writeToFile(updateIndex: boolean): Promise<void> {
    await Fs.promises.writeFile(
      convertPath(`products/${ this.id }.json`),
      this.toJson()
    );
    if (updateIndex) {
      await saveJson(convertPath(`productsIndex.json`), Product.index);
    }
  }

  public toNumber(): number {
    return this.id;
  }

  public static fromInternalName(name: string): Opt<Product> {
    return Opt.create(Product.index[name]);
  }

  public toInternalName(): string {
    return this.internalName;
  }

  public async set(arg: Partial<this>): Promise<void> {
    Object.assign(this, arg);
    await this.writeToFile(false);
  }

  public static async loadProducts(): Promise<void> {
    Product.loaded = await loadAll(
      "products", isProductSource,
      source => new Product(source as ProductSource)
    );
    Product.index = await loadJson(convertPath("productsIndex.json"));
  }
}

export default Product;