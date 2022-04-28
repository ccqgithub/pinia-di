import {
  StoreUse,
  StoreCreator,
  InjectionValue,
  InjectionProvide,
  InjectionContext,
  InjectionProvideObj
} from './types';

type ProviderRecord = {
  creator: StoreCreator;
  use?: StoreUse;
  dispose?: () => void;
};
type ProviderRecords = Map<StoreCreator, ProviderRecord>;

let injectorId = 0;

// service injector
export default class Injector {
  // injector id
  id = '';
  // injector nme
  name = '';
  // configs
  private providers: InjectionProvide[] = [];
  // parent injector
  private parent: Injector | null = null;
  // 当前 injector 上的服务记录
  private records: ProviderRecords = new Map();

  constructor(
    providers: InjectionProvide[],
    opts: {
      parent?: Injector | null;
      oldInjector?: Injector | null;
      name?: string;
    } = {}
  ) {
    const { parent = null, oldInjector = null, name = '' } = opts;

    this.id = `${injectorId++}`;
    this.name = name;
    this.parent = parent;

    const oldProviders = oldInjector?.providers || [];
    const oldUsedKeys: StoreCreator[] = [];
    // provider records
    providers.forEach((provider) => {
      const key = typeof provider === 'object' ? provider.creator : provider;
      const oldProvider = oldProviders.find((item) => {
        return item === key || (item as InjectionProvideObj).creator === key;
      });
      // has old
      if (oldProvider) {
        const oP: InjectionProvideObj =
          typeof oldProvider === 'object'
            ? oldProvider
            : { creator: oldProvider };
        const p: InjectionProvideObj =
          typeof provider === 'object' ? provider : { creator: provider };
        // if the old config of store not change, remain use it
        if (p.creator === oP.creator && p.use === oP.use) {
          oldUsedKeys.push(p.creator);
          this.records.set(p.creator, oldInjector!.records.get(p.creator)!);
          return;
        }
      }

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
        throw new Error(
          `Error provider onfig [${
            (provider as any).$id || provider.toString()
          }]!`
        );
      }

      this.records.set(record.creator, record);
    });

    // dispose old instance
    oldProviders.forEach((v) => {
      const key = typeof v === 'object' ? v.creator : v;
      if (oldUsedKeys.includes(key)) return;
      const record = oldInjector?.records.get(key);
      record?.dispose?.();
    });

    // set providers conf to adjust change
    this.providers = providers;
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
      store = record?.use ? (record?.use() as InjectionValue<P>) : null;
    }

    if (!store && !args?.optional) {
      throw new Error(
        `Store<${
          (provide as any).$id || provide.toString()
        }> not be provided, and not optional!`
      );
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
      },
      useStoreId: (id: string) => {
        return this.name
          ? `${id}~[${this.name}]~<${this.id}>`
          : `${id}~<${this.id}>`;
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
