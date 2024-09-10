import { Opt } from "./opt";

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static fromNumber(type: number): Opt<ProductType> {
    // TODO: Implement this method; now it just returns None
    return Opt.create();
  }

  public toNumber(): number {
    return this.id;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static fromInternalName(name: string): Opt<ProductType> {
    // TODO: Implement this method; now it just returns None
    return Opt.create();
  }

  public toInternalName(): string {
    return this.internalName;
  }
}

export default ProductType;