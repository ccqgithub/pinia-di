import { InjectionProvide, InjectionValue, StoreCreator } from './types';
export default class Injector {
    id: string;
    name: string;
    private parent;
    private records;
    constructor(providers: InjectionProvide[], opts: {
        parent: Injector | null;
        name?: string;
    });
    get<P extends StoreCreator>(provide: P, args: {
        optional: true;
    }): InjectionValue<P> | null;
    get<P extends StoreCreator>(provide: P, args?: {
        optional?: false;
    }): InjectionValue<P>;
    private _initRecord;
    dispose(): void;
}
//# sourceMappingURL=Injector.d.ts.map