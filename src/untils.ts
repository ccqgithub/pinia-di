import { InjectionProvide } from './types';
import Injector from './injector';
import { injectorKey } from './context';

export const getProvideArgs = (providers: InjectionProvide[], name = '') => {
  const injector = new Injector(providers, { name });
  return [injectorKey, injector];
};
