import { StoreDefinition } from 'pinia';

export type StoreCreator = (
  ctx: InjectionContext
) => StoreDefinition<string, any, any, any>;
export type StoreUse = StoreDefinition;

export type InjectionProvideObj = {
  creator: StoreCreator;
  use?: StoreUse;
  disposeOnUnmounted?: boolean;
};
export type InjectionProvide = StoreCreator | InjectionProvideObj;

export type InjectionValue<P extends StoreCreator> = ReturnType<ReturnType<P>>;

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
