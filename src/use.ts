import { provide, inject, onUnmounted, ref, watch, computed } from 'vue';
import { injectorKey } from './context';
import { InjectionProvide, GetStore } from './types';
import Injector from './injector';

export const useProvideStores = (props: {
  stores: InjectionProvide[];
  name?: string;
}) => {
  const parentInjector = inject(injectorKey, null);
  const initInjector = new Injector(props.stores, {
    parent: parentInjector?.value || null,
    oldInjector: null,
    name: props.name
  });
  const injector = ref<Injector>(initInjector);
  let oldInjector: Injector = initInjector;

  const stopWatch = watch(
    () => {
      return {
        parent: parentInjector?.value || null,
        stores: props.stores
      };
    },
    ({ parent, stores }) => {
      injector.value = new Injector(stores, {
        parent,
        oldInjector,
        name: props.name
      });
      oldInjector = injector.value as Injector;
    }
  );

  provide(injectorKey, injector);
  onUnmounted(() => {
    stopWatch();
    injector.value.dispose();
  });
};

export const useStore: GetStore = (provide: any, opts: any) => {
  const injector = inject(injectorKey, null);
  if (!injector) {
    if (!opts || !opts.optional) {
      throw new Error(`Never register any injector for ${provide.toString()}!`);
    }
    return null;
  }
  return computed(() => {
    return injector.value.get(provide, opts);
  });
};
