import { App } from 'vue';
import InjectionToken from './token';

export type InjectionClass = Record<string, any>;

export type InjectionConstructor<T = InjectionClass> = {
  new (...args: any[]): T;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export type InjectionAbstractConstructor<T = InjectionClass> = Function & {
  prototype: T;
};

export type InjectionProvide =
  | InjectionToken
  | InjectionConstructor
  | InjectionAbstractConstructor;

export type InjectionValue<P extends InjectionProvide> =
  P extends InjectionToken<infer V>
    ? V
    : P extends { prototype: infer C }
    ? C
    : never;

export type InjectionDisposer = <P extends InjectionProvide = InjectionProvide>(
  service: InjectionValue<P>
) => void;

export type InjectionProviderObj = {
  provide: InjectionProvide;
  useValue?: any;
  useClass?: InjectionConstructor | null;
  useExisting?: InjectionProvide | null;
  useFactory?:
    | ((ctx: InjectionContext) => InjectionValue<InjectionProvide>)
    | null;
  dispose?: InjectionDisposer | null;
};

export type InjectionProvider = InjectionProvide | InjectionProviderObj;

export type InjectionContext = {
  app: App<Element>;
  useService: GetService;
};

export interface GetService {
  <P extends InjectionProvide>(
    provide: P,
    opts: { optional: true }
  ): InjectionValue<P> | null;
  <P extends InjectionProvide>(
    provide: P,
    opts?: { optional?: false }
  ): InjectionValue<P>;
}
