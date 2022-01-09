import { provide, inject, getCurrentInstance, onUnmounted } from 'vue';
import {
  injectorKey,
  instanceInjectorKey,
  InstanceWithInjector
} from './context';
import { InjectionProvide, GetStore } from './types';
import Injector from './injector';

export const provideStores = (args: {
  stores: InjectionProvide[];
  name?: string;
}) => {
  const instance = getCurrentInstance() as InstanceWithInjector;
  const parentInjector = inject(injectorKey, null);
  const injector = new Injector(args.stores, {
    parent: parentInjector,
    name: args.name
  });
  instance[instanceInjectorKey] = injector;
  provide(injectorKey, injector);
  onUnmounted(() => {
    injector.dispose();
  });
};

export const useStore: GetStore = (provide: any, opts: any) => {
  const instance = getCurrentInstance() as InstanceWithInjector;
  const injector = instance[instanceInjectorKey] || inject(injectorKey, null);
  if (!injector) {
    if (!opts || !opts.optional) {
      throw new Error(`Never register any injectorå!`);
    }
    return null;
  }
  return injector.get(provide, opts);
};
