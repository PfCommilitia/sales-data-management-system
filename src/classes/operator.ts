import { Opt } from "./opt";

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static fromNumber(type: number): Opt<Operator> {
    // TODO: Implement this method; now it just returns None
    return Opt.create();
  }

  public toNumber(): number {
    return this.id;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static fromInternalName(name: string): Opt<Operator> {
    // TODO: Implement this method; now it just returns None
    return Opt.create();
  }

  public toInternalName(): string {
    return this.internalName;
  }
}

export default Operator;