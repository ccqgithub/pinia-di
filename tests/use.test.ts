import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { createPinia } from 'pinia';
import CompChild1 from './use/CompChild1.vue';

describe('useProvideStores', () => {
  it('can keep separate component trees', async () => {
    const pinia = createPinia();

    const nameA = 'Allison';
    const childNameA = 'Lee';

    const nameB = 'Jimmy';
    const childNameB = 'Wong';

    const App = {
      components: {
        CompChild1
      },
      props: {
        nameA: String,
        nameB: String,
        childNameA: String,
        childNameB: String
      },
      template: `
        <div>
          <CompChild1 store-id="store-a1" :name="nameA" :child-name="childNameA" />
          <CompChild1 store-id="store-b1" :name="nameB" :child-name="childNameB" />
        </div>`
    };

    const wrapper = mount(App, {
      props: {
        nameA,
        nameB,
        childNameA,
        childNameB
      },
      global: {
        plugins: [pinia]
      }
    });

    expect(wrapper.html()).toContain(
      'Child1: store-a1 ' + nameA + ' ' + childNameA
    );
    expect(wrapper.html()).toContain(
      'Child2: store-a1 ' + nameA + ' ' + childNameA
    );
    expect(wrapper.html()).toContain('Child1: store-b1 ' + nameB);
    expect(wrapper.html()).toContain('Child2: store-b1 ' + nameB);
  });
});
