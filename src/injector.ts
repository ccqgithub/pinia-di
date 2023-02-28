import {
  StoreUse,
  StoreCreator,
  InjectionValue,
  InjectionProvide,
  InjectionContext
} from './types';
import { getActivePinia } from 'pinia';

type ProviderRecord = {
  creator: StoreCreator;
  use?: StoreUse;
  disposes: ((created: boolean) => void | Promise<void>)[];
  disposeOnUnmounted: boolean;
};
type ProviderRecords = Map<StoreCreator, ProviderRecord>;

let injectorId = 0;

// service injector
export default class Injector {
  // injector id
  id = '';
  // injector nme
  name = '';
  // parent injector
  private parent: Injector | null = null;
  // 当前 injector 上的服务记录
  private records: ProviderRecords = new Map();

  constructor(
    providers: InjectionProvide[],
    opts: {
      parent?: Injector | null;
      name?: string;
    } = {}
  ) {
    const { parent = null, name = '' } = opts;

    this.id = `${injectorId++}`;
    this.name = name;
    this.parent = parent;

    // provider records
    providers.forEach((provider) => {
      let record: ProviderRecord | null = null;
      if (typeof provider === 'object') {
        record = {
          ...provider,
          disposes: [],
          disposeOnUnmounted: provider.disposeOnUnmounted !== false
        };
      } else if (typeof provider === 'function') {
        // [class]
        const p = provider as StoreCreator;
        record = {
          creator: p,
          disposes: [],
          disposeOnUnmounted: true
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
      onUnmounted: (fn: (created: boolean) => void | Promise<void>) => {
        record.disposes.push(fn);
        const remove = () => {
          const i = record.disposes.indexOf(fn);
          if (i !== -1) {
            record.disposes.splice(i, 1);
          }
        };
        return remove;
      },
      useStoreId: (id: string) => {
        return this.name
          ? `${id}~[${this.name}]~<${this.id}>`
          : `${id}~<${this.id}>`;
      }
    };

    record.use = record.creator(ctx);
  }

  async dispose() {
    const { records } = this;
    const keys = records.keys();

    for (const key of keys) {
      const record = records.get(key);
      if (!record || !record.use) return;

      const activePinia = getActivePinia();
      if (!activePinia) return;

      // store created
      const hasCreated = activePinia._s.has(record.use.$id);

      const disposes = record?.disposes || [];
      for (const dispose of disposes) {
        await dispose(hasCreated);
      }

      if (!hasCreated) return;

      record.use().$dispose();
    }
  }
}
