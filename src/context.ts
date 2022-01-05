import { InjectionKey, ComponentInternalInstance } from 'vue';
import Injector from './injector';

export const injectorKey: InjectionKey<Injector> = Symbol('Injector Key');

export const instanceInjectorKey = Symbol('Instance Injector Key');

export type InstanceWithInjector = ComponentInternalInstance & {
  [instanceInjectorKey]: Injector;
};
