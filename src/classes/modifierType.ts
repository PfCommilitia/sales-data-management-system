import { Opt } from "./opt";

export enum ModifierType {
  SALE,
  RESTOCK
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ModifierType {
  export function toNumber(type: ModifierType): number {
    return type as number;
  }

  export function fromNumber(type: number): Opt<ModifierType> {
    switch (type) {
      case 0:
        return Opt.create(ModifierType.SALE);
      case 1:
        return Opt.create(ModifierType.RESTOCK);
    }
    return Opt.create();
  }

  export function fromString(type: string): Opt<ModifierType> {
    switch (type) {
      case "sale":
        return Opt.create(ModifierType.SALE);
      case "restock":
        return Opt.create(ModifierType.RESTOCK);
    }
    return Opt.create();
  }

  export function toString(type: ModifierType): string {
    switch (type) {
      case ModifierType.SALE:
        return "sale";
      case ModifierType.RESTOCK:
        return "restock";
    }
  }
}

export default ModifierType;