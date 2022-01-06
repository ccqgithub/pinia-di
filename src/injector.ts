import {
  InjectionProvide,
  InjectionValue,
  InjectionContext,
  StoreCreator
} from './types';

type ProviderRecord = {
  creator: StoreCreator;
  use?: InjectionValue<any>;
  dispose?: () => void;
};
type ProviderRecords = Map<StoreCreator, ProviderRecord>;

// service injector
export default class Injector {
  // parent injector
  private parent: Injector | null = null;
  // 当前 injector 上的服务记录
  private records: ProviderRecords = new Map();

  constructor(
    providers: InjectionProvide[],
    opts: {
      parent: Injector | null;
    }
  ) {
    const { parent = null } = opts;

    this.parent = parent;

    // provider records
    providers.forEach((provider) => {
      let record: ProviderRecord | null = null;

      if (typeof provider === 'object') {
        record = { ...provider };
      } else if (typeof provider === 'function') {
        // [class]
        const p = provider as StoreCreator;
        record = {
          creator: p
        };
      }

      if (!record) {
        throw new Error(`Error provider onfig [${provider.toString()}]!`);
      }

      this.records.set(record.creator, record);
    });
  }

  get<P extends StoreCreator>(
    provide: P,
    args: { optional: true }
  ): InjectionValue<P> | null;
  get<P extends StoreCreator>(
    provide: P,
    args?: { optional?: false }
  ): InjectionValue<P>;
  get<P extends StoreCreator>(provide: P, args: any): InjectionValue<P> | null {
    const record = this.records.get(provide);
    let store: InjectionValue<P> | null = null;

    // not register on self
    if (!record) {
      if (this.parent) store = this.parent.get(provide, args);
    } else {
      // lazy init service
      if (typeof record.use === 'undefined') {
        this._initRecord(record);
      }
      store = (record.use as InjectionValue<P>) || null;
    }

    if (!store && !args?.optional) {
      throw new Error(`Store not be provided, and not optional!`);
    }

    return store;
  }

  private _initRecord(record: ProviderRecord): void {
    const ctx: InjectionContext = {
      getStore: (provide: StoreCreator, opts: any) => {
        return this.get(provide, opts);
      },
      onUnmounted: (fn: () => void) => {
        record.dispose = fn;
      }
    };

    record.use = record.creator(ctx);
  }

  dispose() {
    const { records } = this;
    const keys = records.keys();
    for (const key of keys) {
      const dispose = records.get(key)?.dispose;
      dispose && dispose();
    }
  }
}
