# DI(dependency-injection) for pinia. work with vue@3

Use [Pinia](https://github.com/vuejs/pinia) more flexibly!

## Define `Store Creator`

> stores/appStore.ts
```ts
import { defineStore } from 'pinia';

export const AppStore = () => {
  return defineStore('main', {
    state: {}
  })
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
const appStore = useStore(AppStore);
</script>
```

## Use Store

> Component.vue
```vue
<script setup>
import { AppStore } from '@/stores/appStore';
import { useStore } from 'pinia-di';

const appStore = useStore(AppStore);
</script>
```

## Store Out Of Componet

> stores/messageStore.ts
```ts
import { defineStore } from 'pinia';

export const MessageStore = () => {
  return defineStore('message', {
    state: {}
  });
}

export const useMessageStore = MessageStore();
```

> App.vue
```vue
<script setup>
import { AppStore } from '@/stores/appStore';
import { useMessageStore, MessageStore } from "@/stores/messageStore';
import { provideStores, useStore } from 'pinia-di';

const messageStore = useMessageStore();

provideStores({ stores: [AppStore, { creator: MessageStore, use: messageStore }] });
// can use by self
const appStore = useStore(AppStore);
</script>
```

> Component.vue
```vue
<script setup>
import { MessageStore } from '@/stores/messageStore';
import { useStore } from 'pinia-di';

const messageStore = useStore(MessageStore);
</script>
```

## Get Other Stores In Sotre

> stores/messageStore.ts
```ts
import { defineStore } from 'pinia';
import { AppStore } from '@/stores/appStore';

export const MessageStore = ({ getStore }) => {
  return defineStore('message', {
    state: {},
    actions: {
      test: () => {
        const appStore = getStore(AppStore);
        console.log(appStore.xxx);
      }
    }
  });
}

export const useMessageStore = MessageStore();
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
const testStore = useStore(TestStore)
</script>
```