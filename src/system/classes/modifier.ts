import { ModifierType } from "./modifierType";
import { Product } from "./product";
import { Operator } from "./operator";
import { Opt } from "./opt";
import { convertPath, loadAll, meta, saveMeta } from "../IO/io";
import * as Fs from "fs";

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

function isModifierSource(obj: Record<string, any>): boolean {
  return typeof obj.id === "number" &&
    typeof obj.type === "number" &&
    typeof obj.product === "object" &&
    typeof obj.product.id === "number" &&
    typeof obj.product.internalName === "string" &&
    typeof obj.operator === "number" &&
    typeof obj.timeStamp === "string" &&
    typeof obj.amount === "number";
}

export class Modifier {
  public static loaded: Modifier[] = [];
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

  public static async generate(
    type: ModifierType,
    product: Product,
    operator: Operator,
    timeStamp: Date,
    amount: number
  ): Promise<Modifier> {
    const modifier = new Modifier({
      id: meta.lastModifierId,
      type: ModifierType.toNumber(type),
      product: {
        id: product.toNumber(),
        internalName: product.toInternalName()
      },
      operator: operator.toNumber(),
      timeStamp: timeStamp.toISOString(),
      amount
    });
    meta.lastModifierId += 1;
    await saveMeta();
    Modifier.loaded.push(modifier);
    await modifier.writeToFile();
    let after = modifier.product.stock;
    switch (modifier.type) {
      case ModifierType.SALE:
        after -= modifier.amount;
        break;
      case ModifierType.RESTOCK:
        after += modifier.amount;
        break;
    }
    await modifier.product.set({ stock: after });
    return modifier;
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

  public static fromNumber(id: number): Opt<Modifier> {
    return Opt.create(Modifier.loaded[id]);
  }

  public async writeToFile(): Promise<void> {
    await Fs.promises.writeFile(
      convertPath(`modifiers/${ this.toNumber() }.json`),
      this.toJson(),
      "utf-8"
    );
  }

  public toNumber(): number {
    return this.id;
  }

  public async set(arg: Partial<this>): Promise<void> {
    Object.assign(this, arg);
    await this.writeToFile();
  }

  public static async loadModifiers(): Promise<void> {
    Modifier.loaded = await loadAll(
      "modifiers", isModifierSource,
      source => new Modifier(source as ModifierSource)
    );
  }
}

export default Modifier;