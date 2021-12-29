import { InjectionContext } from './types';

export default class InjectionToken<V = any> {
  private _desc: string;
  factory?: ((ctx: InjectionContext) => V) | null;

  constructor(
    desc: string,
    options?: {
      factory: (ctx: InjectionContext) => V;
    }
  ) {
    this._desc = desc;
    this.factory = options?.factory;
  }

  toString(): string {
    return `InjectionToken: ${this._desc}`;
  }
}
