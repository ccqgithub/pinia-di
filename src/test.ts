import { InjectionContext, Injector } from './index';
import { defineStore } from 'pinia';

export const VehicleStore = (ctx: InjectionContext) => defineStore(ctx.useStoreId('vehicles'), () => {
    console.log(ctx)
})
const i = new Injector([VehicleStore], {name: 'foo'})

console.log(i)