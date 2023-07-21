import { defineComponent, PropType } from 'vue';
import { InjectionProvide } from './types';
import { useProvideStores } from './use';

const StoreProvider = defineComponent({
  props: {
    stores: { type: Object as PropType<InjectionProvide[]>, required: true },
    name: { type: String, requred: false }
  },
  setup(props, { slots }) {
    useProvideStores({
      stores: props.stores,
      name: props.name
    });

    return () => slots.default?.() || null;
  }
});

export default StoreProvider;
