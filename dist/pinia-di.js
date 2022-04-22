'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var vue = require('vue');

const injectorKey = Symbol('Injector Key');

let injectorId$1 = 0;
// service injector
class Injector$1 {
    constructor(providers, opts = {}) {
        // injector id
        this.id = '';
        // injector nme
        this.name = '';
        // configs
        this.providers = [];
        // parent injector
        this.parent = null;
        // 当前 injector 上的服务记录
        this.records = new Map();
        const { parent = null, oldInjector = null, name = '' } = opts;
        this.id = `${injectorId$1++}`;
        this.name = name;
        this.parent = parent;
        const oldProviders = (oldInjector === null || oldInjector === void 0 ? void 0 : oldInjector.providers) || [];
        const oldUsedKeys = [];
        // provider records
        providers.forEach((provider) => {
            const key = typeof provider === 'object' ? provider.creator : provider;
            const oldProvider = oldProviders.find((item) => {
                return item === key || item.creator === key;
            });
            // has old
            if (oldProvider) {
                const oP = typeof oldProvider === 'object'
                    ? oldProvider
                    : { creator: oldProvider };
                const p = typeof provider === 'object' ? provider : { creator: provider };
                // if the old config of store not change, remain use it
                if (p.creator === oP.creator && p.use === oP.use) {
                    oldUsedKeys.push(p.creator);
                    this.records.set(p.creator, oldInjector.records.get(p.creator));
                    return;
                }
            }
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
        // dispose old instance
        oldProviders.forEach((v) => {
            var _a;
            const key = typeof v === 'object' ? v.creator : v;
            if (oldUsedKeys.includes(key))
                return;
            const record = oldInjector === null || oldInjector === void 0 ? void 0 : oldInjector.records.get(key);
            (_a = record === null || record === void 0 ? void 0 : record.dispose) === null || _a === void 0 ? void 0 : _a.call(record);
        });
        // set providers conf to adjust change
        this.providers = providers;
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
            },
            useStoreId: (id) => {
                return this.name
                    ? `${id}~[${this.name}]~<${this.id}>`
                    : `${id}~<${this.id}>`;
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

let injectorId = 0;
// service injector
class Injector {
    constructor(providers, opts = {}) {
        // injector id
        this.id = '';
        // injector nme
        this.name = '';
        // configs
        this.providers = [];
        // parent injector
        this.parent = null;
        // 当前 injector 上的服务记录
        this.records = new Map();
        const { parent = null, oldInjector = null, name = '' } = opts;
        this.id = `${injectorId++}`;
        this.name = name;
        this.parent = parent;
        const oldProviders = (oldInjector === null || oldInjector === void 0 ? void 0 : oldInjector.providers) || [];
        const oldUsedKeys = [];
        // provider records
        providers.forEach((provider) => {
            const key = typeof provider === 'object' ? provider.creator : provider;
            const oldProvider = oldProviders.find((item) => {
                return item === key || item.creator === key;
            });
            // has old
            if (oldProvider) {
                const oP = typeof oldProvider === 'object'
                    ? oldProvider
                    : { creator: oldProvider };
                const p = typeof provider === 'object' ? provider : { creator: provider };
                // if the old config of store not change, remain use it
                if (p.creator === oP.creator && p.use === oP.use) {
                    oldUsedKeys.push(p.creator);
                    this.records.set(p.creator, oldInjector.records.get(p.creator));
                    return;
                }
            }
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
        // dispose old instance
        oldProviders.forEach((v) => {
            var _a;
            const key = typeof v === 'object' ? v.creator : v;
            if (oldUsedKeys.includes(key))
                return;
            const record = oldInjector === null || oldInjector === void 0 ? void 0 : oldInjector.records.get(key);
            (_a = record === null || record === void 0 ? void 0 : record.dispose) === null || _a === void 0 ? void 0 : _a.call(record);
        });
        // set providers conf to adjust change
        this.providers = providers;
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
            },
            useStoreId: (id) => {
                return this.name
                    ? `${id}~[${this.name}]~<${this.id}>`
                    : `${id}~<${this.id}>`;
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

const StoreProvider = vue.defineComponent({
    props: {
        stores: { type: Object, required: true },
        name: { type: String, requred: false }
    },
    setup(props) {
        const parentInjector = vue.inject(injectorKey, null);
        const initInjector = new Injector(props.stores, {
            parent: (parentInjector === null || parentInjector === void 0 ? void 0 : parentInjector.value) || null,
            oldInjector: null,
            name: props.name
        });
        const injector = vue.ref(initInjector);
        let oldInjector = initInjector;
        const stopWatch = vue.watch(() => {
            return {
                parent: (parentInjector === null || parentInjector === void 0 ? void 0 : parentInjector.value) || null,
                stores: props.stores
            };
        }, ({ parent, stores }) => {
            injector.value = new Injector(stores, {
                parent,
                oldInjector,
                name: props.name
            });
            oldInjector = injector.value;
        });
        vue.provide(injectorKey, injector);
        vue.onUnmounted(() => {
            stopWatch();
            injector.value.dispose();
        });
    }
});

const useProvideStores = (props) => {
    const parentInjector = vue.inject(injectorKey, null);
    const initInjector = new Injector$1(props.stores, {
        parent: (parentInjector === null || parentInjector === void 0 ? void 0 : parentInjector.value) || null,
        oldInjector: null,
        name: props.name
    });
    const injector = vue.ref(initInjector);
    let oldInjector = initInjector;
    const stopWatch = vue.watch(() => {
        return {
            parent: (parentInjector === null || parentInjector === void 0 ? void 0 : parentInjector.value) || null,
            stores: props.stores
        };
    }, ({ parent, stores }) => {
        injector.value = new Injector$1(stores, {
            parent,
            oldInjector,
            name: props.name
        });
        oldInjector = injector.value;
    });
    vue.provide(injectorKey, injector);
    vue.onUnmounted(() => {
        stopWatch();
        injector.value.dispose();
    });
};
const useStore = (provide, opts) => {
    const injector = vue.inject(injectorKey, null);
    if (!injector) {
        if (!opts || !opts.optional) {
            throw new Error(`Never register any injector for ${provide.toString()}!`);
        }
        return null;
    }
    return vue.computed(() => {
        return injector.value.get(provide, opts);
    });
};

const getProvideArgs = (providers, name = '') => {
    const injector = new Injector$1(providers, { name });
    return [injectorKey, injector];
};

exports.Injector = Injector$1;
exports.StoreProvider = StoreProvider;
exports.getProvideArgs = getProvideArgs;
exports.injectorKey = injectorKey;
exports.useProvideStores = useProvideStores;
exports.useStore = useStore;
