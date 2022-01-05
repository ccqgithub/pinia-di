import { defineComponent, provide, inject, PropType, onUnmounted } from 'vue';
import { InjectionProvide } from './types';
import Injector from './Injector';
import { injectorKey } from './context';

const StoreProvider = defineComponent({
  props: {
    stores: { type: Object as PropType<InjectionProvide[]>, required: true }
  },
  setup(props) {
    const parentInjector = inject(injectorKey);
    const injector = new Injector(props.stores, {
      parent: parentInjector || null
    });
    provide(injectorKey, injector);
    onUnmounted(() => {
      injector.dispose();
    });
  }
});

export default StoreProvider;
