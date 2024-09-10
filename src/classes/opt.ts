export class Opt<T> {
  private value: undefined | T;

  public constructor(value?: T) {
    this.value = value;
  }

  public static create<T>(value?: T): Opt<T> {
    return new Opt(value);
  }

  public unwrap(): T {
    if (this === undefined) {
      throw new Error("Called unwrap on a None value");
    }
    return this.value as T;
  }

  public unwrapOr(defaultValue: T): T {
    if (this === undefined) {
      return defaultValue;
    }
    return this.value as T;
  }

  public unwrapOrElse(defaultValue: () => T): T {
    if (this === undefined) {
      return defaultValue();
    }
    return this.value as T;
  }

  public unwrapExpect(message: string): T {
    if (this === undefined) {
      throw new Error(message);
    }
    return this.value as T;
  }

  public get isSome(): boolean {
    return this.value !== undefined;
  }

  public get isNone(): boolean {
    return this.value === undefined;
  }
}

export default Opt;