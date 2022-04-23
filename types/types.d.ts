import { StoreDefinition } from 'pinia';
export declare type StoreCreator = (ctx: InjectionContext) => StoreDefinition;
export declare type StoreUse = StoreDefinition;
export declare type InjectionProvideObj = {
    creator: StoreCreator;
    use?: StoreUse;
};
export declare type InjectionProvide = StoreCreator | InjectionProvideObj;
export declare type InjectionValue<P extends StoreCreator> = ReturnType<ReturnType<P>>;
export declare type InjectionContext = {
    getStore: GetStore;
    onUnmounted: (fn: () => void) => void;
    useStoreId: (id: string) => string;
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