import { defineComponent, inject, provide, onUnmounted, getCurrentInstance } from 'vue';

const injectorKey = Symbol('Injector Key');
const instanceInjectorKey = Symbol('Instance Injector Key');

// service injector
class Injector$1 {
    constructor(providers, opts) {
        // parent injector
        this.parent = null;
        // 当前 injector 上的服务记录
        this.records = new Map();
        const { parent = null } = opts;
        this.parent = parent;
        // provider records
        providers.forEach((provider) => {
            let record = null;
            if (typeof provider === 'object') {
                record = Object.assign({}, provider);
            }
            else if (typeof provider === 'function') {
                // [class]
                const p = provider;
                record = {
                    creator: p
                };
            }
            if (!record) {
                throw new Error(`Error provider onfig [${provider.toString()}]!`);
            }
            this.records.set(record.creator, record);
        });
    }
    get(provide, args) {
        const record = this.records.get(provide);
        let store = null;
        // not register on self
        if (!record) {
            if (this.parent)
                store = this.parent.get(provide, args);
        }
        else {
            // lazy init service
            if (typeof record.use === 'undefined') {
                this._initRecord(record);
            }
            store = record.use || null;
        }
        if (!store && !(args === null || args === void 0 ? void 0 : args.optional)) {
            throw new Error(`Store not be provided, and not optional!`);
        }
        return store;
    }
    _initRecord(record) {
        const ctx = {
            getStore: (provide, opts) => {
                return this.get(provide, opts);
            },
            onUnmounted: (fn) => {
                record.dispose = fn;
            }
        };
        record.use = record.creator(ctx);
    }
    dispose() {
        var _a;
        const { records } = this;
        const keys = records.keys();
        for (const key of keys) {
            const dispose = (_a = records.get(key)) === null || _a === void 0 ? void 0 : _a.dispose;
            dispose && dispose();
        }
    }
}

// service injector
class Injector {
    constructor(providers, opts) {
        // parent injector
        this.parent = null;
        // 当前 injector 上的服务记录
        this.records = new Map();
        const { parent = null } = opts;
        this.parent = parent;
        // provider records
        providers.forEach((provider) => {
            let record = null;
            if (typeof provider === 'object') {
                record = Object.assign({}, provider);
            }
            else if (typeof provider === 'function') {
                // [class]
                const p = provider;
                record = {
                    creator: p
                };
            }
            if (!record) {
                throw new Error(`Error provider onfig [${provider.toString()}]!`);
            }
            this.records.set(record.creator, record);
        });
    }
    get(provide, args) {
        const record = this.records.get(provide);
        let store = null;
        // not register on self
        if (!record) {
            if (this.parent)
                store = this.parent.get(provide, args);
        }
        else {
            // lazy init service
            if (typeof record.use === 'undefined') {
                this._initRecord(record);
            }
            store = record.use || null;
        }
        if (!store && !(args === null || args === void 0 ? void 0 : args.optional)) {
            throw new Error(`Store not be provided, and not optional!`);
        }
        return store;
    }
    _initRecord(record) {
        const ctx = {
            getStore: (provide, opts) => {
                return this.get(provide, opts);
            },
            onUnmounted: (fn) => {
                record.dispose = fn;
            }
        };
        record.use = record.creator(ctx);
    }
    dispose() {
        var _a;
        const { records } = this;
        const keys = records.keys();
        for (const key of keys) {
            const dispose = (_a = records.get(key)) === null || _a === void 0 ? void 0 : _a.dispose;
            dispose && dispose();
        }
    }
}

const StoreProvider = defineComponent({
    props: {
        stores: { type: Object, required: true }
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

const provideStores = (args) => {
    const instance = getCurrentInstance();
    const parentInjector = inject(injectorKey, null);
    const injector = new Injector$1(args.stores, {
        parent: parentInjector
    });
    instance[instanceInjectorKey] = injector;
    provide(injectorKey, injector);
    onUnmounted(() => {
        injector.dispose();
    });
};
const useStore = (provide, opts) => {
    const instance = getCurrentInstance();
    const injector = instance[instanceInjectorKey] || inject(injectorKey, null);
    if (!injector) {
        if (!opts || !opts.optional) {
            throw new Error(`Never register any injectorå!`);
        }
        return null;
    }
    return injector.get(provide, opts);
};
const storeIds = {};
const useStoreId = (id) => {
    if (!storeIds[id])
        storeIds[id] = 0;
    storeIds[id]++;
    return `${id}~${storeIds[id]}}`;
};

export { Injector$1 as Injector, StoreProvider, injectorKey, instanceInjectorKey, provideStores, useStore, useStoreId };
