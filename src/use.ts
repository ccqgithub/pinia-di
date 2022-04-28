import { provide, inject, onUnmounted } from 'vue';
import Injector from './injector';
import { injectorKey } from './context';
import {
  InjectionProvide,
  StoreCreator,
  InjectionValue,
  GetStore
} from './types';

export const useProvideStores = (props: {
  stores: InjectionProvide[];
  name?: string;
}) => {
  const parentInjector = inject(injectorKey, null);
  const injector = new Injector(props.stores, {
    parent: parentInjector,
    oldInjector: null,
    name: props.name
  });

  provide(injectorKey, injector);
  onUnmounted(() => {
    injector.dispose();
  });

  return {
    getStore: (provide: any, opts: any) => {
      return injector.get(provide, opts);
    }
  } as {
    getStore: GetStore;
  };
};

export function useStore<P extends StoreCreator>(
  provide: P,
  opts: { optional: true }
): InjectionValue<P> | null;
export function useStore<P extends StoreCreator>(
  provide: P,
  opts?: { optional?: false }
): InjectionValue<P>;
export function useStore(provide: any, opts: any) {
  const injector = inject(injectorKey, null);
  if (!injector) {
    if (!opts || !opts.optional) {
      throw new Error(
        `Never register any injector for ${
          (provide as any).$id || provide.toString()
        }!`
      );
    }
    return null;
  }
  return injector.get(provide, opts);
}
