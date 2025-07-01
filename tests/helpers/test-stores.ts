import { InjectionContext, useStore } from '../../src';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const nameStoreFactory = () => {
  const name = ref<string>('');

  const childNameStore = useStore(ChildNameStoreWithId);

  function setName(nameValue: string, childNameValue: string) {
    name.value = nameValue;
    childNameStore.setChildName(childNameValue);
  }

  return {
    name,
    setName
  };
};

export const childNameStoreFactory = () => {
  const childName = ref<string>('');

  function setChildName(nameValue: string) {
    childName.value = nameValue;
  }

  return {
    childName,
    setChildName
  };
};

export const NameStoreWithId = (ctx: InjectionContext) => {
  return defineStore(ctx.useStoreId('name-nameStore'), nameStoreFactory);
};

export const ChildNameStoreWithId = (ctx: InjectionContext) => {
  return defineStore(
    ctx.useStoreId('child-name-nameStore'),
    childNameStoreFactory
  );
};
