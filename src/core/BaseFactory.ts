export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export abstract class BaseFactory<T> {
  protected sequenceId = 1;

  abstract definition(): T;

  build(overrides: DeepPartial<T> = {}): T {
    const defaults = this.definition();
    this.sequenceId++;
    return this.deepMerge(defaults, overrides);
  }

  buildList(count: number, overrides: DeepPartial<T> = {}): T[] {
    return Array.from({ length: count }, () => this.build(overrides));
  }

  private deepMerge(target: any, source: any): any {
    const output = { ...target };
    if (this.isObject(target) && this.isObject(source)) {
      Object.keys(source).forEach((key) => {
        if (this.isObject(source[key])) {
          if (!(key in target)) Object.assign(output, { [key]: source[key] });
          else output[key] = this.deepMerge(target[key], source[key]);
        } else {
          Object.assign(output, { [key]: source[key] });
        }
      });
    }
    return output;
  }

  private isObject(item: any): boolean {
    return item && typeof item === 'object' && !Array.isArray(item);
  }
}
