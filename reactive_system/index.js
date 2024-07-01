// 存储副作用函数的桶 建立副作用函数与被操作的字段之间的联系
const bucket = new WeakMap()

// 在 get 拦截函数内调用 track 函数追踪变化
function track(target, key) {
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
    deps.add(activeEffect)
}

// 在 set 拦截函数内调用 trigger 函数触发变化
function trigger(target, key) {
    // 根据target从桶中取得depsMap
    const depsMap = bucket.get(target)
    if(!depsMap) return
    // 根据key取得所有副作用函数effects
    const effects = depsMap.get(key)
    // 把副作用函数从桶里取出来执行
    effects && effects.forEach(fn => fn())
}

// 原始数据
const data = { text: 'hello world' }
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

// 用一个全局变量存储被注册的副作用函数 不需要硬编码副作用函数的名字(effect)
let activeEffect
// 注册副作用函数
function effect(fn) {
    // 当调用effect注册副作用函数时，将副作用函数fn赋值给activeEffect
    activeEffect = fn
    // 执行副作用函数
    fn()
}

effect(() => {
    let a
    a = obj.text
    console.log(a)
})

setTimeout(() => {
    obj.noExist = 'hello vue3'
}, 1000)