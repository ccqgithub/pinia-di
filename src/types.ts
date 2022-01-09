import { StoreDefinition } from 'pinia';

export type StoreCreator = (ctx: InjectionContext) => StoreDefinition;
export type StoreUse = StoreDefinition;

export type InjectionProvide =
  | StoreCreator
  | {
      creator: StoreCreator;
      use?: StoreUse;
    };

export type InjectionValue<P extends StoreCreator> = ReturnType<P>;

export type InjectionContext = {
  getStore: GetStore;
  onUnmounted: (fn: () => void) => void;
  useStoreId: (id: string) => string;
};

export interface GetStore {
  <P extends StoreCreator>(
    provide: P,
    opts: { optional: true }
  ): InjectionValue<P> | null;
  <P extends StoreCreator>(
    provide: P,
    opts?: { optional?: false }
  ): InjectionValue<P>;
}
