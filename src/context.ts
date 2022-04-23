import { InjectionKey } from 'vue';
import Injector from './injector';

export const injectorKey: InjectionKey<Injector> = Symbol('Injector Key');
