import { assert, beforeEach, describe, expect, it } from 'vitest';
import { InjectionContext, Injector, StoreCreator } from '../src';
import {
  createPinia,
  defineStore,
  setActivePinia,
  StoreDefinition
} from 'pinia';

describe('injector', () => {
  beforeEach(async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
  });

  describe('injector class created from StoreCreator', () => {
    let store1Unmounted = false;
    let store1UnmountedRemoved = false;
    let store2Unmounted = false;
    let store2UnmountedRemoved = false;

    const useStore1 = defineStore('store-1', () => ({})) as StoreDefinition;
    const useStore2 = defineStore('store-2', () => ({})) as StoreDefinition;

    let removeUnmounted1: () => void;
    let removeUnmounted2: () => void;

    const creator1: StoreCreator = (ctx: InjectionContext) => {
      const storeId = ctx.useStoreId('testing');
      expect(storeId).toEqual('testing~<0>');

      const otherStore = ctx.getStore(creator2);
      expect(otherStore).toEqual(useStore2());

      removeUnmounted1 = ctx.onUnmounted(() => {
        store1UnmountedRemoved = true;
      });
      ctx.onUnmounted(() => {
        store1Unmounted = true;
      });

      return useStore1;
    };

    const creator2: StoreCreator = (ctx: InjectionContext) => {
      removeUnmounted2 = ctx.onUnmounted(() => {
        store2UnmountedRemoved = true;
      });

      ctx.onUnmounted(() => {
        store2Unmounted = true;
      });

      return useStore2;
    };

    const providers = [creator1, creator2];

    const injector = new Injector(providers);

    it('sets defaults', () => {
      expect(injector.id).toEqual('0');
      expect(injector.name).toEqual('');
      expect(injector.get(creator1)).toEqual(useStore1());
      expect(injector.get(creator2)).toEqual(useStore2());
    });

    it('unMounts stores when dispose() is called', async () => {
      injector.get(creator1);
      injector.get(creator2);

      removeUnmounted1();
      removeUnmounted2();

      await injector.dispose();

      expect(store1Unmounted).toEqual(true);
      expect(store1UnmountedRemoved).toEqual(false);
      expect(store2Unmounted).toEqual(true);
      expect(store2UnmountedRemoved).toEqual(false);
    });

    it('handles invalid providers', async () => {
      assert.throws(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        new Injector([false]);
      }, 'Provider config Error [false]!');
    });
  });
});
