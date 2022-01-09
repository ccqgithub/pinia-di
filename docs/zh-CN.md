# pinia-id: 更灵活地使用 [Pinia](https://github.com/vuejs/pinia)！

在 [Pinia](https://github.com/vuejs/pinia) 中使用 DI(dependency-injection：依赖注入)。 依赖 vue@3。

[English Document](../README.md)

## 核心概念

- `Store Use`: Pinia 的 [defineStore](https://pinia.vuejs.org/core-concepts/#defining-a-store) 的返回值.
- `Store Creator`: 一个返回 `Store Use` 的函数。
- `InjectionContext`: `Store Creator` 调用时收到的参数。

## InjectionContext: `{ getStore, useStoreId, onUnmounted }`

`getStore`: 获取当前组建或者父组件提供的`Store Use`。
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

`useStoreId`: 因为 `pinia` 使用 `id` 来标识一个Store, 但是 `Store Creator` 可能会被调用多次生成多个Store, 所以我们需要 `useStoreId` 来为每个Store生成唯一的ID。
```ts
import { InjectionContext } from 'pinia-di';
export const TestStore = ({ useStoreId }: InjectionContext) => {
  return defineStore(useStoreId('test'), {
    state: {},
  });
}
```

`onUnmounted`: 绑定一个函数，这个函数在Store被卸载时调用。
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

## 定义 `Store Creator`

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

## 提供 Store

> App.vue
```vue
<script setup>
import { provideStores, useStore } from 'pinia-di';
import { AppStore } from '@/stores/appStore';

provideStores({ stores: [AppStore] }, name: 'App');
// 可以被自己使用
const appStore = useStore(AppStore)();
</script>
```

## 使用 Store

> Component.vue
```vue
<script setup>
import { useStore } from 'pinia-di';
import { AppStore } from '@/stores/appStore';

const appStore = useStore(AppStore)();
</script>
```

## 在组件外面使用 Store

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
// 可以被自己使用
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

## 在 Store 里面获取另外的 Store

> stores/messageStore.ts
```ts
import { defineStore } from 'pinia';
import { useStoreId } from 'pinia-di';

export const MessageStore = ({ getStore, useStoreId }: InjectionContext) => {
  return defineStore(useStoreId('message'), {
    state: {},
    actions: {
      test: () => {
        // 获取当前组建或者父组件提供的`Store Use`。
        const appStore = getStore(AppStore);
        console.log(appStore.xxx);
      }
    }
  });
}

export const useMessageStore = MessageStore();
```

## Store 卸载

> stores/appStore.ts
```ts
import { defineStore } from 'pinia';

export const AppStore = ({ onUnmounted, useStoreId }: InjectionContext) => {
  // 定义 Store, useStoreId('main') 生成唯一的ID。
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

如果一个 `store creator`被祖先组件提供多次, `useStore`或获取到最近的一个。

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

## 使用 `StoreProvider` 组件来提供 `Store`。

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