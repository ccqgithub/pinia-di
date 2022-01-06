# DI(dependency-injection) for pinia. work with vue@3

Use [Pinia](https://github.com/vuejs/pinia) more flexibly!

## Define `Store Creator`

> stores/appStore.ts
```ts
import { defineStore } from 'pinia';
import { useStoreId } from 'pinia-di';

export const AppStore = () => {
  return defineStore(useStoreId('main'), {
    state: {},
  });
}
```

## Provide Store

> App.vue
```vue
<script setup>
import { AppStore } from '@/stores/appStore';
import { provideStores, useStore } from 'pinia-di';

provideStores({ stores: [AppStore] });
// can use by self
const appStore = useStore(AppStore)();
</script>
```

## Use Store

> Component.vue
```vue
<script setup>
import { AppStore } from '@/stores/appStore';
import { useStore } from 'pinia-di';

const appStore = useStore(AppStore)();
</script>
```

## Store Out Of Componet

> stores/messageStore.ts
```ts
import { defineStore } from 'pinia';
import { useStoreId } from 'pinia-di';

export const MessageStore = () => {
  return defineStore(useStoreId('message'), {
    state: {}
  });
}

export const useMessageStore = MessageStore();
```

> App.vue
```vue
<script setup>
import { AppStore } from '@/stores/appStore';
import { useMessageStore, MessageStore } from '@/stores/messageStore';
import { provideStores, useStore } from 'pinia-di';

provideStores({ stores: [AppStore, { creator: MessageStore, use: useMessageStore }] });
// can use by self
const appStore = useStore(AppStore)();
</script>
```

> Component.vue
```vue
<script setup>
import { MessageStore } from '@/stores/messageStore';
import { useStore } from 'pinia-di';

const messageStore = useStore(MessageStore)();
</script>
```

## Get Other Stores In Sotre

> stores/messageStore.ts
```ts
import { defineStore } from 'pinia';
import { useStoreId } from 'pinia-di';
import { AppStore } from '@/stores/appStore';

export const MessageStore = ({ getStore }) => {
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
import { useStoreId } from 'pinia-di';

export const AppStore = ({ onUnmounted }) => {
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
import { TestStore } from '@/stores/testStore';
import { provideStores } from 'pinia-di';

provideStores({ stores: [TestStore] });
</script>
```

> ParentB.Vue
```vue
<template>
  <Child/>
</template>

<script setup>
import { TestStore } from '@/stores/testStore';
import { provideStores } from 'pinia-di';

provideStores({ stores: [TestStore] });
</script>
```

> Child.Vue
```vue
<script setup>
import { TestStore } from '@/stores/testStore';
import { useStore } from 'pinia-di';

// will get the store provided by ParentB
const testStore = useStore(TestStore)();
</script>
```

## Use Component Provider

> App.vue
```vue
<template>
  <StoreProvider stores=[AppStore]>
    <Root />
  </StoreProvider> 
</template>

<script setup>
import { AppStore } from '@/stores/appStore';
import { useStore, StoreProvider } from 'pinia-di';
</script>
```