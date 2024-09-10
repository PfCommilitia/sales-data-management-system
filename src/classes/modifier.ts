import { ModifierType } from "./modifierType";
import { Product } from "./product";
import { Operator } from "./operator";
import { Opt } from "./opt";

interface ModifierSource {
  id: number;
  type: number;
  product: {
    id: number;
    internalName: string;
  };
  operator: number;
  timeStamp: string;
  amount: number;
}

export class Modifier {
  public id: number;
  public type: ModifierType;
  public product: Product;
  public operator: Operator;
  public timeStamp: Date;
  public amount: number;

  public constructor(fromObject: ModifierSource) {
    this.id = fromObject.id;
    this.type = ModifierType.fromNumber(fromObject.type).unwrap();
    this.product = Product.fromNumber(fromObject.product.id).unwrap();
    this.operator = Operator.fromNumber(fromObject.operator).unwrap();
    this.timeStamp = new Date(fromObject.timeStamp);
    this.amount = fromObject.amount;
  }

  public static fromJson(json: string): Modifier {
    return new Modifier(JSON.parse(json));
  }

  public toJson(): string {
    return JSON.stringify({
      id: this.toNumber(),
      type: ModifierType.toNumber(this.type),
      product: {
        id: this.product.toNumber(),
        internalName: this.product.toInternalName()
      },
      operator: this.operator.toNumber(),
      timeStamp: this.timeStamp.toISOString(),
      amount: this.amount
    } as ModifierSource);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static fromNumber(type: number): Opt<Modifier> {
    // TODO: Implement this method; now it just returns None
    return Opt.create();
  }

  public toNumber(): number {
    return this.id;
  }
}

export default Modifier;