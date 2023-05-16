import { PropType } from 'vue';
import { InjectionProvide } from './types';
declare const StoreProvider: import("vue").DefineComponent<{
    stores: {
        type: PropType<InjectionProvide[]>;
        required: true;
    };
    name: {
        type: StringConstructor;
        requred: boolean;
    };
}, void, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    stores: {
        type: PropType<InjectionProvide[]>;
        required: true;
    };
    name: {
        type: StringConstructor;
        requred: boolean;
    };
}>>, {}, {}>;
export default StoreProvider;
//# sourceMappingURL=StoreProvider.d.ts.map