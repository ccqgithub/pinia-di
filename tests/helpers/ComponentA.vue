<script setup lang="ts">
import { useStore } from '../../src';
import { TestStoreA } from './test-stores';

const store = useStore(TestStoreA);
</script>
<template>
  {{ store.value }}
</template>
