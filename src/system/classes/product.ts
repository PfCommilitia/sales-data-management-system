import { ProductType } from "./productType";
import { Opt } from "./opt";
import * as Fs from "fs";
import { convertPath } from "../IO/io";

interface ProductSource {
  id: number;
  internalName: string;
  type: number;
  deleted: boolean;
}

export class Product {
  public id: number;
  public internalName: string;
  public type: ProductType;
  public deleted: boolean;

  public constructor(fromObject: ProductSource) {
    this.id = fromObject.id;
    this.internalName = fromObject.internalName;
    this.type = ProductType.fromNumber(fromObject.type).unwrap();
    this.deleted = fromObject.deleted;
  }

  public static fromJson(json: string): Product {
    return new Product(JSON.parse(json));
  }

  public toJson(): string {
    return JSON.stringify({
      id: this.toNumber(),
      internalName: this.toInternalName(),
      type: this.type.toNumber(),
      deleted: this.deleted
    } as ProductSource);
  }

  public static fromNumber(type: number): Opt<Product> {
    try {
      return Opt.create(
        new Product(JSON.parse(Fs.readFileSync(convertPath(`products/${ type }.json`), "utf-8")))
      );
    } catch(err) {
      return Opt.create();
    }
  }

  public writeToFile(): void {
    Fs.writeFileSync(convertPath(`products/${ this.id }.json`), this.toJson());
    try {
      const index = JSON.parse(Fs.readFileSync(convertPath(`products/index.json`), "utf-8"));
      index[this.toInternalName()] = this.toNumber();
      Fs.writeFileSync(convertPath(`products/index.json`), JSON.stringify(index));
    } catch (err) {
      Fs.writeFileSync(
        convertPath(`products/index.json`),
        JSON.stringify({ [this.toInternalName()]: this.toNumber() })
      );
    }
  }

  public toNumber(): number {
    return this.id;
  }

  public static fromInternalName(name: string): Opt<Product> {
    const index = JSON.parse(Fs.readFileSync(convertPath(`products/index.json`), "utf-8"))[name];
    if (index === undefined) {
      return Opt.create();
    }
    return Product.fromNumber(index);
  }

  public toInternalName(): string {
    return this.internalName;
  }
}

export default Product;