import computed from "./computed"
import watch  from "./watch"

// 存储副作用函数的桶 建立副作用函数与被操作的字段之间的联系
const bucket = new WeakMap()

// 在 get 拦截函数内调用 track 函数追踪变化
export const track = (target, key) => {
    if (!activeEffect) return
    let depsMap = bucket.get(target)
    //  如果不存在，则新建一个Map并与target关联
    if (!depsMap) {
        bucket.set(target, (depsMap = new Map()))
    }
    // 再根据key从depsMap中取得deps，里面存储着所有与当前key相关联的副作用函数effects
    let deps = depsMap.get(key)
    // 如果不存在，同样新建一个Set并与key关联
    if(!deps) {
        depsMap.set(key, (deps = new Set()))
    }
    // 把当前激活的副作用函数添加到依赖集合deps中
    deps.add(activeEffect)
    // deps就是一个与当前副作用函数存在联系的依赖集合
    activeEffect.deps.push(deps)
}

// 在 set 拦截函数内调用 trigger 函数触发变化
export const trigger = (target, key) => {
    // 根据target从桶中取得depsMap
    const depsMap = bucket.get(target)
    if(!depsMap) return
    // 根据key取得所有副作用函数effects
    const effects = depsMap.get(key)

    // 把副作用函数从桶里取出来执行
    const effectsToRun = new Set()
    effects && effects.forEach(effectFn => {
        // 如果触发执行的副作用函数与当前正在执行的副作用函数相同，则不触发执行
        if (effects !== activeEffect) {
            effectsToRun.add(effectFn)
        }
    })
    effectsToRun.forEach(effectFn => {
        // 如果存在调度器，则调用该调度器，并将副作用函数作为参数
        if (effectFn.options.scheduler) {
            effectFn.options.scheduler(effectFn)
        } else {
            effectFn()
        }
    })
}

function cleanup(effectFn) {
    for (let i = 0; i < effectFn.deps.length; i++) {
        // deps是依赖集合
        const deps = effectFn.deps[i]
        // 将effectFn从依赖集合中移除
        deps.delete(effectFn)
    }
    // 重置effectFn.deps
    effectFn.deps.length = 0
}

// 原始数据
const data = { foo: 1, bar: 1}
// 对原始数据的代理
const obj = new Proxy(data, {
    // 拦截读取操作
    get(target, key) {
        // 将副作用函数activeEffect添加到存储副作用函数的桶中
        track(target, key)

        // 返回属性值
        return target[key]
    },
    // 拦截设置操作
    set(target, key, newVal) {
        // 设置属性值
        target[key] = newVal

        // 把副作用函数从桶里取出并执行
        trigger(target, key)

        // 返回true表示设置操作成功
        return true
    }
})

// 用一个全局变量存储当前激活的effect函数 不需要硬编码副作用函数的名字(effect)
let activeEffect
// effect栈
const effectStack = []

// 注册副作用函数
export const effect = (fn, options = {}) => {
    const effectFn = () => {
        // 调用cleanup函数完成清除工作
        cleanup(effectFn)
        // 当调用effect注册副作用函数时，将副作用函数fn赋值给activeEffect
        activeEffect = effectFn
        // 在调用副作用函数之前将当前副作用函数压入栈中
        effectStack.push(effectFn)
        const res = fn()
        // 执行完毕后，将当前副作用函数弹出栈，并还原为之前的值
        effectStack.pop()
        activeEffect = effectStack[effectStack.length - 1]
        return res
    }
    // 挂载
    effectFn.options = options
    // activeEffect.deps用来存储所有与该副作用函数相关联的依赖集合
    effectFn.deps = []
    if (!options.lazy) {
        // 执行副作用函数 
        effectFn()
    }
    // 将副作用函数作为返回值返回
    return effectFn
}


watch(
    () => obj.foo, 
    (newValue, oldValue) => {
        console.log('数据变化了', newValue, oldValue)
    },
    {
        immediate: true
    }
)

const sum = computed(() => obj.bar + obj.foo)
console.log(sum.value)
console.log(sum.value)
console.log(sum.value)