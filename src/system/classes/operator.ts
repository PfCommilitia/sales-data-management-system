import { Opt } from "./opt";
import {
  convertPath,
  loadAll,
  loadJson,
  meta,
  saveJson,
  saveMeta
} from "../IO/io";
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

  public static async generate(internalName: string): Promise<Operator> {
    const operator = new Operator({ id: meta.lastOperatorId, internalName });
    meta.lastOperatorId += 1;
    await saveMeta();
    Operator.loaded.push(operator);
    Operator.index[operator.toInternalName()] = operator;
    await operator.writeToFile(true);
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

  public async writeToFile(updateIndex: boolean): Promise<void> {
    await Fs.promises.writeFile(
      convertPath(`operators/${ this.id }.json`),
      this.toJson()
    );
    if (updateIndex) {
      const indexNumber = {} as Record<string, number>;
      for (const key in Operator.index) {
        const obj = Operator.index[key];
        indexNumber[key] = obj.toNumber();
      }
      await saveJson(convertPath(`operatorsIndex.json`), indexNumber);
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

  public async set(arg: Partial<this>): Promise<void> {
    Object.assign(this, arg);
    await this.writeToFile(false);
  }

  public static async loadOperators(): Promise<void> {
    Operator.loaded = await loadAll(
      "operators", isOperatorSource,
      source => new Operator(source as OperatorSource)
    );
    const indexRaw = await loadJson(convertPath(`operatorsIndex.json`));
    Operator.index = {};
    for (const key in indexRaw) {
      Operator.index[key] = Operator.fromNumber(indexRaw[key]).unwrap();
    }
  }
}

export default Operator;