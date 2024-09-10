import { ProductType } from "./productType";
import { Opt } from "./opt";

interface ProductSource {
  id: number;
  internalName: string;
  type: number;
}

export class Product {
  public id: number;
  public internalName: string;
  public type: ProductType;

  public constructor(fromObject: ProductSource) {
    this.id = fromObject.id;
    this.internalName = fromObject.internalName;
    this.type = ProductType.fromNumber(fromObject.type).unwrap();
  }

  public static fromJson(json: string): Product {
    return new Product(JSON.parse(json));
  }

  public toJson(): string {
    return JSON.stringify({
      id: this.toNumber(),
      internalName: this.toInternalName(),
      type: this.type.toNumber()
    } as ProductSource);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static fromNumber(type: number): Opt<Product> {
    // TODO: Implement this method; now it just returns None
    return Opt.create();
  }

  public toNumber(): number {
    return this.id;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static fromInternalName(name: string): Opt<Product> {
    // TODO: Implement this method; now it just returns None
    return Opt.create();
  }

  public toInternalName(): string {
    return this.internalName;
  }
}

export default Product;