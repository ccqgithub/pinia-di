import { InjectionKey, Ref } from 'vue';
import Injector from './injector';

export const injectorKey: InjectionKey<Ref<Injector>> = Symbol('Injector Key');
