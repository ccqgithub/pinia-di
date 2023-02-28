'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var vue = require('vue');
var pinia = require('pinia');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}

let injectorId = 0;
// service injector
class Injector {
    constructor(providers, opts = {}) {
        // injector id
        this.id = '';
        // injector nme
        this.name = '';
        // parent injector
        this.parent = null;
        // 当前 injector 上的服务记录
        this.records = new Map();
        const { parent = null, name = '' } = opts;
        this.id = `${injectorId++}`;
        this.name = name;
        this.parent = parent;
        // provider records
        providers.forEach((provider) => {
            let record = null;
            if (typeof provider === 'object') {
                record = Object.assign(Object.assign({}, provider), { disposes: [], disposeOnUnmounted: provider.disposeOnUnmounted !== false });
            }
            else if (typeof provider === 'function') {
                // [class]
                const p = provider;
                record = {
                    creator: p,
                    disposes: [],
                    disposeOnUnmounted: true
                };
            }
            if (!record) {
                throw new Error(`Error provider onfig [${provider.$id || provider.toString()}]!`);
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
            store = (record === null || record === void 0 ? void 0 : record.use) ? record === null || record === void 0 ? void 0 : record.use() : null;
        }
        if (!store && !(args === null || args === void 0 ? void 0 : args.optional)) {
            throw new Error(`Store<${provide.$id || provide.toString()}> not be provided, and not optional!`);
        }
        return store;
    }
    _initRecord(record) {
        const ctx = {
            getStore: (provide, opts) => {
                return this.get(provide, opts);
            },
            onUnmounted: (fn) => {
                record.disposes.push(fn);
                const remove = () => {
                    const i = record.disposes.indexOf(fn);
                    if (i !== -1) {
                        record.disposes.splice(i, 1);
                    }
                };
                return remove;
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
        return __awaiter(this, void 0, void 0, function* () {
            const { records } = this;
            const keys = records.keys();
            for (const key of keys) {
                const record = records.get(key);
                if (!record || !record.use)
                    return;
                const activePinia = pinia.getActivePinia();
                if (!activePinia)
                    return;
                // store created
                const hasCreated = activePinia._s.has(record.use.$id);
                const disposes = (record === null || record === void 0 ? void 0 : record.disposes) || [];
                for (const dispose of disposes) {
                    yield dispose(hasCreated);
                }
                if (!hasCreated)
                    return;
                record.use().$dispose();
            }
        });
    }
}

const injectorKey = Symbol('Injector Key');

const useProvideStores = (props) => {
    const instance = vue.getCurrentInstance();
    const parentInjector = vue.inject(injectorKey, null);
    const injector = new Injector(props.stores, {
        parent: parentInjector,
        name: props.name
    });
    if (instance) {
        instance.__PINIA_DI_INJECTOR__ = injector;
    }
    vue.provide(injectorKey, injector);
    vue.onUnmounted(() => {
        injector.dispose();
    });
    return {
        getStore: (provide, opts) => {
            return injector.get(provide, opts);
        }
    };
};
function useStore(provide, opts) {
    var _a;
    const instance = vue.getCurrentInstance();
    const ctxInjector = vue.inject(injectorKey, null);
    const injector = ((_a = instance) === null || _a === void 0 ? void 0 : _a.__PINIA_DI_INJECTOR__) || ctxInjector;
    if (!injector) {
        if (!opts || !opts.optional) {
            throw new Error(`Never register any injector for ${provide.$id || provide.toString()}!`);
        }
        return null;
    }
    return injector.get(provide, opts);
}

const getProvideArgs = (providers, name = '') => {
    const injector = new Injector(providers, { name });
    return [injectorKey, injector];
};

const StoreProvider = vue.defineComponent({
    props: {
        stores: { type: Object, required: true },
        name: { type: String, requred: false }
    },
    setup(props) {
        useProvideStores({
            stores: props.stores,
            name: props.name
        });
    }
});

exports.Injector = Injector;
exports.StoreProvider = StoreProvider;
exports.getProvideArgs = getProvideArgs;
exports.injectorKey = injectorKey;
exports.useProvideStores = useProvideStores;
exports.useStore = useStore;
