import { Opt } from "./opt";
import { convertPath } from "../IO/io";
import * as Fs from "fs";

interface OperatorSource {
  id: number;
  internalName: string;
}

export class Operator {
  public id: number;
  public internalName: string;

  public constructor(fromObject: OperatorSource) {
    this.id = fromObject.id;
    this.internalName = fromObject.internalName;
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

  public static fromNumber(type: number): Opt<Operator> {
    try {
      return Opt.create(
        Operator.fromJson(Fs.readFileSync(convertPath(`operators/${ type }.json`), "utf-8"))
      );
    } catch (err) {
      return Opt.create();
    }
  }

  public writeToFile(): void {
    Fs.writeFileSync(convertPath(`operators/${ this.id }.json`), this.toJson());
    try {
      const index = JSON.parse(Fs.readFileSync(convertPath(`operators/index.json`), "utf-8"));
      index[this.toInternalName()] = this.toNumber();
      Fs.writeFileSync(convertPath(`operators/index.json`), JSON.stringify(index));
    } catch (err) {
      Fs.writeFileSync(
        convertPath(`operators/index.json`),
        JSON.stringify({ [this.toInternalName()]: this.toNumber() })
      );
    }
  }

  public toNumber(): number {
    return this.id;
  }

  public static fromInternalName(name: string): Opt<Operator> {
    const index = JSON.parse(Fs.readFileSync(convertPath(`operators/index.json`), "utf-8"))[name];
    if (index === undefined) {
      return Opt.create();
    }
    return Operator.fromNumber(index);
  }

  public toInternalName(): string {
    return this.internalName;
  }
}

export default Operator;