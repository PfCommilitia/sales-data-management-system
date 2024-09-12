import { Opt } from "./opt";
import { convertPath, loadAll, meta } from "../IO/io";
import * as Fs from "fs";

interface OperatorSource {
  id: number;
  internalName: string;
}

function isOperatorSource(obj: Record<string, any>): boolean {
  return typeof obj.id === "number" &&
    typeof obj.internalName === "string";
}

export class Operator {
  public static loaded: Operator[] = [];
  public static index: Record<string, Operator> = {};
  public id: number;
  public internalName: string;

  public constructor(fromObject: OperatorSource) {
    this.id = fromObject.id;
    this.internalName = fromObject.internalName;
  }

  public static generate(internalName: string): Operator {
    const operator = new Operator({ id: meta.lastOperatorId, internalName });
    meta.lastOperatorId += 1;
    operator.writeToFile(true);
    Operator.loaded.push(operator);
    Operator.index[operator.toInternalName()] = operator;
    return operator;
  }

  public static fromJson(json: string): Operator {
    return new Operator(JSON.parse(json));
  }

  public toJson(): string {
    return JSON.stringify({
      id: this.toNumber(),
      internalName: this.toInternalName()
    } as OperatorSource);
  }

  public static fromNumber(id: number): Opt<Operator> {
    return Opt.create(Operator.loaded[id]);
  }

  public writeToFile(updateIndex: boolean): void {
    Fs.writeFileSync(convertPath(`operators/${ this.id }.json`), this.toJson());
    if (updateIndex) {
      Fs.writeFileSync(
        convertPath(`operatorsIndex.json`), JSON.stringify(Operator.index)
      );
    }
  }

  public toNumber(): number {
    return this.id;
  }

  public static fromInternalName(name: string): Opt<Operator> {
    return Opt.create(Operator.index[name]);
  }

  public toInternalName(): string {
    return this.internalName;
  }

  public set(arg: Partial<this>): void {
    Object.assign(this, arg);
    this.writeToFile(false);
  }

  public static async loadOperators(): Promise<void> {
    Operator.loaded = await loadAll(
      "operators", isOperatorSource,
      source => new Operator(source as OperatorSource)
    );
    try {
      Operator.index = JSON.parse(
        Fs.readFileSync(convertPath("operatorsIndex.json"), "utf-8")
      );
    } catch (err) {
      Operator.index = {};
    }
  }
}

export default Operator;