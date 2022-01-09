# DI(dependency-injection) for pinia. work with vue@3

Use [Pinia](https://github.com/vuejs/pinia) more flexibly!

## Essentials

- `Store Use`: The `return` of [defineStore](https://pinia.vuejs.org/core-concepts/#defining-a-store).
- `Store Creator`: A function that return a `Store Use`.
- `InjectionContext`: The parameter that the `Store Creator` will receive.

## InjectionContext: `{ getStore, useStoreId, onUnmounted }`

`getStore`: Get other store that have been provided by parent component or self component.
```ts
import { InjectionContext } from 'pinia-di';
import { OtherStore } from './stores/other';

export const AppStore = ({ getStore }: InjectionContext) => {
  return defineStore('app', {
    state: {},
    actions: {
      test() {
        const otherStore = getStore(OtherStore)();
        console.log(otherStore.xx);
      }
    }
  });
}
```

`useStoreId`: Because `pinia` use `id` to identify one store, but our `Store Creator` maybe use multiple times, so we need a method `useStoreId` to generate the unique id.
```ts
import { InjectionContext } from 'pinia-di';
export const TestStore = ({ useStoreId }: InjectionContext) => {
  return defineStore(useStoreId('test'), {
    state: {},
  });
}
```

`onUnmounted`: Bind a function that will be invoked when the store unmounted.
```ts
import { InjectionContext } from 'pinia-di';
export const TestStore = ({ onUnmounted }: InjectionContext) => {
  const useTestStore = defineStore(useStoreId('test'), {
    state: {},
    actions: {
      dispose() {
        console.log('dispose');
      }
    }
  });

  onUnmounted(() => {
    useTestStore().dispose();
  });

  return useTestStore;
}
```

## Define `Store Creator`

> stores/appStore.ts
```ts
import { defineStore } from 'pinia';
import { InjectionContext } from 'pinia-di';

export const AppStore = ({ useStoreId }: InjectionContext) => {
  return defineStore(useStoreId('main'), {
    state: {},
  });
}
```

## Provide Store

> App.vue
```vue
<script setup>
import { provideStores, useStore } from 'pinia-di';
import { AppStore } from '@/stores/appStore';

provideStores({ stores: [AppStore] }, name: 'App');
// can use by self
const appStore = useStore(AppStore)();
</script>
```

## Use Store

> Component.vue
```vue
<script setup>
import { useStore } from 'pinia-di';
import { AppStore } from '@/stores/appStore';

const appStore = useStore(AppStore)();
</script>
```

## Store Out Of Componet

> stores/messageStore.ts
```ts
import { defineStore } from 'pinia';

export const MessageStore = ({ useStoreId }: InjectionContext) => {
  return defineStore(useStoreId('message'), {
    state: {}
  });
}

export const useMessageStore = MessageStore();
```

> App.vue
```vue
<script setup>
import { provideStores, useStore } from 'pinia-di';
import { AppStore } from '@/stores/appStore';
import { useMessageStore, MessageStore } from '@/stores/messageStore';

provideStores({ stores: [AppStore, { creator: MessageStore, use: useMessageStore }] }, name: 'App');
// can use by self
const appStore = useStore(AppStore)();
</script>
```

> Component.vue
```vue
<script setup>
import { useStore } from 'pinia-di';
import { MessageStore } from '@/stores/messageStore';

const messageStore = useStore(MessageStore)();
</script>
```

## Get Other Stores In Sotre

> stores/messageStore.ts
```ts
import { defineStore } from 'pinia';
import { useStoreId } from 'pinia-di';

export const MessageStore = ({ getStore, useStoreId }: InjectionContext) => {
  return defineStore(useStoreId('message'), {
    state: {},
    actions: {
      test: () => {
        // get other store that parent component or self provided
        const appStore = getStore(AppStore);
        console.log(appStore.xxx);
      }
    }
  });
}

export const useMessageStore = MessageStore();
```

## Store Onunmounted

> stores/appStore.ts
```ts
import { defineStore } from 'pinia';

export const AppStore = ({ onUnmounted, useStoreId }: InjectionContext) => {
  // define store, useStoreId('main') generate the unique id for per `Store Instance`
  const useMainstore = defineStore(useStoreId('main'), {
    state: {},
    actions: {
      dispose: () => {
        //
      }
    }
  });

  onUnmounted(() => {
    useMainstore().dispose();
  });

  return useMainstore();
}
```

## Store Tree

If same `store creator` provided by more than one parent, the `useStore` will get the nearest one.

> ParentA.Vue
```vue
<template>
  <ParentB/>
</template>

<script setup>
import { provideStores } from 'pinia-di';
import { TestStore } from '@/stores/testStore';

provideStores({ stores: [TestStore] }, name: 'ParentA');
</script>
```

> ParentB.Vue
```vue
<template>
  <Child/>
</template>

<script setup>
import { provideStores } from 'pinia-di';
import { TestStore } from '@/stores/testStore';

provideStores({ stores: [TestStore] }, name: 'ParentB');
</script>
```

> Child.Vue
```vue
<script setup>
import { useStore } from 'pinia-di';
import { TestStore } from '@/stores/testStore';

// will get the store provided by ParentB
const testStore = useStore(TestStore)();
</script>
```

## Use Component Provider

> App.vue
```vue
<template>
  <StoreProvider stores=[AppStore] name="App">
    <Root />
  </StoreProvider> 
</template>

<script setup>
import { StoreProvider } from 'pinia-di';
import { AppStore } from '@/stores/appStore';
</script>
```