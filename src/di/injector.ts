import { App } from 'vue';
import InjectionToken from './token';
import {
  InjectionProvide,
  InjectionValue,
  InjectionDisposer,
  InjectionProvider,
  InjectionProviderObj,
  InjectionContext,
  InjectionConstructor
} from './types';

type ProviderRecord = {
  provide: InjectionProvide;
  value?: any;
  useClass?: InjectionConstructor | null;
  useExisiting?: InjectionProvide | null;
  dispose?: InjectionDisposer | null;
  useFactory?:
    | (<P extends InjectionProvide>(ctx: InjectionContext) => InjectionValue<P>)
    | null;
};
type ProviderRecords = Map<InjectionProvide, ProviderRecord>;

// service injector
export default class Injector {
  // parent injector
  private parent: Injector | null = null;
  // 当前 injector 上的服务记录
  private records: ProviderRecords = new Map();
  app: App<Element>;

  constructor(
    providers: InjectionProvider[],
    opts: {
      parent: Injector | null;
      app: App<Element>;
    }
  ) {
    const { parent = null, app } = opts;

    this.app = app;
    this.parent = parent;

    // provider records
    providers.forEach((provider) => {
      let record: ProviderRecord | null = null;

      if (typeof provider === 'object') {
        // [{ provide, ...}]
        const p = provider as InjectionProviderObj;
        // check
        const keys = ['useValue', 'useClass', 'useExisiting', 'useFactory'];
        let apear = 0;
        keys.forEach((key) => {
          if (typeof p[key as keyof InjectionProviderObj] !== 'undefined') {
            apear++;
          }
        });
        if (apear > 1) {
          throw new Error(
            `These keys [${keys.join(
              ','
            )}] can only use one, other will be ignored!`,
          );
        }
        // normalize
        const { useValue = undefined, ...rest } = p;
        record = {
          ...rest,
          value: useValue
        };
      } else if (
        typeof provider === 'function' &&
        typeof (provider as InjectionConstructor).prototype.constructor ===
          'function'
      ) {
        // [class]
        const p = provider as InjectionProvide;
        record = {
          provide: p,
          useClass: p as InjectionConstructor
        };
      }

      if (!record) {
        throw new Error(`Error provider onfig [${provider.toString()}]!`);
      }

      const hasTokenFactory =
        record.provide instanceof InjectionToken && record.useFactory;
      if (
        typeof record.value === 'undefined' &&
        !record.useClass &&
        !record.useExisiting &&
        !record.useFactory &&
        !hasTokenFactory
      ) {
        throw new Error(`Error provider onfig [${provider.toString()}]!`);
      }

      this.records.set(record.provide, record);
    });
  }

  isProvided(provide: InjectionProvide): boolean {
    if (this.records.has(provide)) return true;
    if (this.parent) return this.parent.isProvided(provide);
    return false;
  }

  get<P extends InjectionProvide>(
    provide: P,
    args: { optional: true }
  ): InjectionValue<P> | null;
  get<P extends InjectionProvide>(
    provide: P,
    args?: { optional?: false }
  ): InjectionValue<P>;
  get<P extends InjectionProvide>(
    provide: P,
    args: any
  ): InjectionValue<P> | null {
    const record = this.records.get(provide);
    let service = null;

    // not register on self
    if (!record) {
      if (this.parent) service = this.parent.get(provide, args);
    } else {
      // lazy init service
      if (typeof record.value === 'undefined') {
        this.$_initRecord(record);
      }
      service = record.value || null;
    }

    if (!service && !args?.optional) {
      throw new Error(`Service not be provided, and not optional!`);
    }

    return service;
  }

  private $_initRecord(record: ProviderRecord): void {
    const ctx: InjectionContext = {
      app: this.app,
      useService: (provide: InjectionProvide, opts: any) => {
        return this.get(provide, opts);
      }
    };

    // token 中的 factory 优先
    // injection token's default value
    if (record.provide instanceof InjectionToken && record.provide.factory) {
      record.value = record.provide.factory(ctx);
    }

    // use class
    if (record.useClass) {
      // find deps for the useClass
      record.value = new record.useClass(ctx);
      return;
    }

    // alias: use exisiting
    if (record.useExisiting) {
      record.value = this.get(record.useExisiting);
      return;
    }

    // use factory
    if (record.useFactory) {
      record.value = record.useFactory<typeof record.provide>(ctx);
    }
  }

  dispose(): void {
    for (const [, record] of this.records) {
      if (!record.value) return;
      if (record.dispose) {
        record.dispose(record.value);
      } else if (typeof record.value.dispose === 'function') {
        record.value.dispose();
      }
    }
    this.parent = null;
    this.records.clear();
  }
}
