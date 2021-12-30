import { StoreDefinition } from 'pinia';

export type StoreCreator = (ctx: InjectionContext) => StoreDefinition;
export type StoreUse = ReturnType<StoreCreator>;

export type InjectionProvide =
  | StoreCreator
  | {
      creator: StoreCreator;
      use?: StoreUse;
    };

export type InjectionValue<P extends StoreCreator> = ReturnType<ReturnType<P>>;

export type InjectionContext = {
  getStore: GetStore;
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
