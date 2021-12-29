import { reactive, computed, markRaw } from 'vue';
import { Constructor } from './types';

export const createStore = <T extends Record<string, any>>(Store: Constructor<T>): T => {
  const store = new Store();
  const keys = Object.keys(store);
  keys.forEach((key) => {
    const value = store[key];
    const descriptor = Object.getOwnPropertyDescriptor(store, key);
    if (typeof value !== 'function' || !descriptor) return;
    // computed
    if (descriptor.get) {
      store[key as keyof T] = markRaw(
        computed(() => {
          return descriptor.get!.call(store);
        }) as T[keyof T]
      );
    }
    // actions
    store[key as keyof T] = markRaw(
      ((...args: any[]) => {
        return value.call(store, store, ...args);
      }) as T[keyof T]
    );
  });

  return reactive(store);
}