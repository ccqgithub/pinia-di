export type Method = (...args: any[]) => any;
export type Constructor<T> = {
  new (...args: any[]): T;
};
export type StoreMethod = (...args: any[]) => any;
export type StoreActions = Record<string, StoreMethod>;
export type StoreGetters = Record<string, StoreMethod>;

export type StoreOptions = {
  state: Record<string, any>;
  getters?: StoreGetters;
  actions?: StoreActions;
};

export type StoreInstance<T extends StoreOptions = StoreOptions> = T['state'] & T['getters'] & T['actions'];