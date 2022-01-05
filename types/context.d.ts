import { InjectionKey, ComponentInternalInstance } from 'vue';
import Injector from './injector';
export declare const injectorKey: InjectionKey<Injector>;
export declare const instanceInjectorKey: unique symbol;
export declare type InstanceWithInjector = ComponentInternalInstance & {
    [instanceInjectorKey]: Injector;
};
//# sourceMappingURL=context.d.ts.map