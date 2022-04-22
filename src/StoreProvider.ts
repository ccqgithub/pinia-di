import {
  defineComponent,
  provide,
  inject,
  PropType,
  onUnmounted,
  ref,
  watch
} from 'vue';
import { InjectionProvide } from './types';
import Injector from './Injector';
import { injectorKey } from './context';

const StoreProvider = defineComponent({
  props: {
    stores: { type: Object as PropType<InjectionProvide[]>, required: true },
    name: { type: String, requred: false }
  },
  setup(props) {
    const parentInjector = inject(injectorKey, null);
    const initInjector = new Injector(props.stores, {
      parent: parentInjector?.value || null,
      oldInjector: null,
      name: props.name
    });
    const injector = ref<Injector>(initInjector);
    let oldInjector: Injector = initInjector;

    const stopWatch = watch(
      () => {
        return {
          parent: parentInjector?.value || null,
          stores: props.stores
        };
      },
      ({ parent, stores }) => {
        injector.value = new Injector(stores, {
          parent,
          oldInjector,
          name: props.name
        });
        oldInjector = injector.value as Injector;
      }
    );

    provide(injectorKey, injector);
    onUnmounted(() => {
      stopWatch();
      injector.value.dispose();
    });
  }
});

export default StoreProvider;
