import { InjectionProvide } from './types';
import Injector from './injector';
import { injectorKey } from './context';
import { InjectionKey } from 'vue';

export const getProvideArgs = (
  providers: InjectionProvide[],
  name = ''
): [InjectionKey<Injector>, Injector] => {
  const injector = new Injector(providers, { name });
  return [injectorKey, injector];
};
