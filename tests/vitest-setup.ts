import { beforeEach } from 'vitest';
import { setActivePinia } from 'pinia';

beforeEach(() => {
  setActivePinia(undefined);
});
