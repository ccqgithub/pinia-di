import {
  provide,
  inject,
  getCurrentInstance,
} from 'vue';
import { GetService, Injector, InjectionProvider } from '../di';
import {
  injectorKey,
  instanceInjectorKey,
  InstanceWithInjector
} from './context';
import { nomalizeSotreProviders } from '../utils';

export const provideStore = (args: { stores: InjectionProvider[] }) => {
  const instance = getCurrentInstance() as InstanceWithInjector;
  const parentInjector = inject(injectorKey, null);
  const injector = new Injector(nomalizeSotreProviders(args.stores), {
    parent: parentInjector,
    app: instance.appContext.app
  });
  instance[instanceInjectorKey] = injector;
  provide(injectorKey, injector);
};

export const useGetStore = (): GetService => {
  const instance = getCurrentInstance() as InstanceWithInjector;
  const injector = instance[instanceInjectorKey] || inject(injectorKey, null);
  const getService: GetService = (provide: any, opts: any) => {
    if (!injector) {
      if (!opts || !opts.optional) {
        throw new Error(`Never register any injector!`);
      }
      return null;
    }
    return injector.get(provide, opts);
  };
  return getService;
};

export const useStore: GetService = (provide: any, opts: any) => {
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
