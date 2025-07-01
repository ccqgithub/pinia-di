<script setup lang="ts">
import { useProvideStores, useStore } from '../../src';
import { ChildNameStoreWithId, NameStoreWithId } from '../helpers/test-stores';
import { watch } from 'vue';
import CompChild2 from './CompChild2.vue';

const { name, childName, storeId } = defineProps({
  name: String,
  childName: String,
  storeId: String
});

useProvideStores({
  stores: [NameStoreWithId, ChildNameStoreWithId],
  name: storeId
});

const nameStore = useStore(NameStoreWithId);
const childNameStore = useStore(ChildNameStoreWithId);

watch(
  () => name,
  () => nameStore.setName(name, childName),
  { immediate: true }
);
</script>
<template>
  <div>Child1: {{ storeId }} {{ nameStore.name }} {{childNameStore.childName}}</div>
  <CompChild2 :store-id="storeId" />
</template>
