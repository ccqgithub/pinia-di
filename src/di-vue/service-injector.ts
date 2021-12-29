import {
  defineComponent,
  provide,
  inject,
  PropType,
  getCurrentInstance,
  ComponentInternalInstance
} from 'vue';
import { InjectionProvider, Injector } from '../di';
import { injectorKey } from './context';
import { nomalizeSotreProviders } from '../utils';

const ServiceInjector = defineComponent({
  props: {
    providers: { type: Object as PropType<InjectionProvider[]>, required: true }
  },
  setup(props) {
    const instance = getCurrentInstance() as ComponentInternalInstance;
    const parentInjector = inject(injectorKey);
    const injector = new Injector(nomalizeSotreProviders(props.providers), {
      parent: parentInjector || null,
      app: instance?.appContext.app
    });
    provide(injectorKey, injector);
  }
});

export default ServiceInjector;
