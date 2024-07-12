import computed from "./computed"
import watch  from "./watch"
import { reactive, readOnly, shallowReactive, shallowReadonly } from "./reactive"
import { proxyRefs, toRefs } from "./ref"
import { effect } from "./effect"
// watch(
//     () => obj.foo, 
//     (newValue, oldValue) => {
//         console.log('数据变化了', newValue, oldValue)
//     },
//     {
//         immediate: true
//     }
// )

// const sum = computed(() => obj.bar + obj.foo)


// 原始数据
const obj = reactive({ foo: 1, bar: 2 })
const newObj = proxyRefs({ ...toRefs(obj) })

effect(() => {
    console.log(newObj.foo)
})

newObj.foo = 1546