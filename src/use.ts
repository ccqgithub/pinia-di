import { provide, inject, getCurrentInstance } from 'vue';
import {
  injectorKey,
  instanceInjectorKey,
  InstanceWithInjector
} from './context';
import { InjectionProvide, GetStore } from './types';
import Injector from './injector';

export const provideStores = (args: { stores: InjectionProvide[] }) => {
  const instance = getCurrentInstance() as InstanceWithInjector;
  const parentInjector = inject(injectorKey, null);
  const injector = new Injector(args.stores, {
    parent: parentInjector
  });
  instance[instanceInjectorKey] = injector;
  provide(injectorKey, injector);
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

const storeIds: Record<string, number> = {};
export const useStoreId = (id: string) => {
  if (!storeIds[id]) storeIds[id] = 0;
  storeIds[id]++;
  return `${id}~${storeIds[id]}}`;
};
