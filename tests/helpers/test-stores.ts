import { InjectionContext } from '../../types';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const TestStoreA = (ctx: InjectionContext) => {
  return defineStore('main', () => {
    const value = ref('');

    return {
      value
    };
  });
};
