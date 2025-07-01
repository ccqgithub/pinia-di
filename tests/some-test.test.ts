import { mount } from '@vue/test-utils';
import ComponentA from './helpers/ComponentA.vue';
import { useStore } from '../src';
import { TestStoreA } from './helpers/test-stores';

describe('Actions', () => {
  it('default injection', () => {
    const wrapper = mount(ComponentA, {
      propsData: { message: '' }
    });

    const store = useStore(TestStoreA);

    const expected = 'testing';

    store.value = expected;

    expect(wrapper.html()).toContain(expected);
  });
});
