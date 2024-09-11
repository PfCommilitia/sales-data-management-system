import { Opt } from "./opt";
import * as Fs from "fs";
import { convertPath } from "../IO/io";

interface ProductTypeSource {
  id: number;
  internalName: string;
}

export class ProductType {
  public id: number;
  public internalName: string;

  public constructor(fromObject: ProductTypeSource) {
    this.id = fromObject.id;
    this.internalName = fromObject.internalName;
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

  public static fromNumber(type: number): Opt<ProductType> {
    try {
      return Opt.create(
        new ProductType(JSON.parse(Fs.readFileSync(convertPath(`productTypes/${ type }.json`), "utf-8")))
      );
    } catch(err) {
      return Opt.create();
    }
  }

  public writeToFile(): void {
    Fs.writeFileSync(convertPath(`productTypes/${ this.id }.json`), this.toJson());
    try {
      const index = JSON.parse(Fs.readFileSync(convertPath(`productTypes/index.json`), "utf-8"));
      index[this.toInternalName()] = this.toNumber();
      Fs.writeFileSync(convertPath(`productTypes/index.json`), JSON.stringify(index));
    } catch (err) {
      Fs.writeFileSync(
        convertPath(`productTypes/index.json`),
        JSON.stringify({ [this.toInternalName()]: this.toNumber() })
      );
    }
  }

  public toNumber(): number {
    return this.id;
  }

  public static fromInternalName(name: string): Opt<ProductType> {
    const index = JSON.parse(Fs.readFileSync(convertPath(`productTypes/index.json`), "utf-8"))[name];
    if (index === undefined) {
      return Opt.create();
    }
    return ProductType.fromNumber(index);
  }

  public toInternalName(): string {
    return this.internalName;
  }
}

export default ProductType;