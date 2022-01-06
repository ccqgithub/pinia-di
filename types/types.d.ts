import { StoreDefinition } from 'pinia';
export declare type StoreCreator = (ctx: InjectionContext) => StoreDefinition;
export declare type StoreUse = StoreDefinition;
export declare type InjectionProvide = StoreCreator | {
    creator: StoreCreator;
    use?: StoreUse;
};
export declare type InjectionValue<P extends StoreCreator> = ReturnType<P>;
export declare type InjectionContext = {
    getStore: GetStore;
    onUnmounted: (fn: () => void) => void;
};
export interface GetStore {
    <P extends StoreCreator>(provide: P, opts: {
        optional: true;
    }): InjectionValue<P> | null;
    <P extends StoreCreator>(provide: P, opts?: {
        optional?: false;
    }): InjectionValue<P>;
}
//# sourceMappingURL=types.d.ts.map