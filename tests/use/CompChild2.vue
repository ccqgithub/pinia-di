<script setup lang="ts">
import { useStore } from '../../src';
import { ChildNameStoreWithId, NameStoreWithId } from '../helpers/test-stores';

const { storeId } = defineProps({
  storeId: String
});

const nameStore = useStore(NameStoreWithId);
const childNameStore = useStore(ChildNameStoreWithId);

</script>
<template>
  <div>Child2: {{ storeId }} {{ nameStore.name }} {{childNameStore.childName}}</div>
</template>
