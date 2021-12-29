import { InjectionProvider } from "./di";
import { createStore } from "./store";

export const nomalizeSotreProvider = (provider: InjectionProvider): InjectionProvider => {
  // store class
  if (typeof provider === "function") {
    return {
      provide: provider,
      useValue: createStore(provider),
    }
  }
  return provider;
}

export const nomalizeSotreProviders = (providers: InjectionProvider[]) => {
  return providers.map((provider) => nomalizeSotreProvider(provider));
}