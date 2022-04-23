import { InjectionProvide, StoreCreator, InjectionValue, GetStore } from './types';
export declare const useProvideStores: (props: {
    stores: InjectionProvide[];
    name?: string;
}) => {
    getStore: GetStore;
};
export declare function useStore<P extends StoreCreator>(provide: P, opts: {
    optional: true;
}): InjectionValue<P> | null;
export declare function useStore<P extends StoreCreator>(provide: P, opts?: {
    optional?: false;
}): InjectionValue<P>;
//# sourceMappingURL=use.d.ts.map