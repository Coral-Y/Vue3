import {  track, trigger, ITERATE_KEY } from './index'

// 封装createReactive函数，接收一个参数isShallow,代表是否为浅响应
const createReactive = (obj, isShallow = false, isReadOnly = false) => {
    return new Proxy(obj, {    
        // 拦截读取操作
        get(target, key, receiver) {
            // 代理对象可以通过 raw 属性访问原始数据
            if (key === 'raw') {
                return target
            }

            // 得到原始值结果
            const res = Reflect.get(target, key, receiver)

            // 添加判断，如果 key 的类型是 symbol，则不进行追踪
            if (!isReadOnly && typeof key !== 'symbol') {
                // 将副作用函数activeEffect添加到存储副作用函数的桶中
                track(target, key)
            }

            // 如果是浅响应，则直接返回原始值
            if (isShallow) {
                return res
            }

            if (typeof res === 'object' && res !== null) {
                // 调用reactive将结果包装成响应式数据并返回
                return isReadOnly ? readOnly(res) : reactive(res)
            }

            // 返回属性值
            return res
        },
        // 拦截设置操作
        set(target, key, newVal, receiver) {
            if (isReadOnly) {
                console.log(`属性${key}是只读的`)
                return true
            }
            // 先获取旧值
            const oldVal = target[key]

            // 如果属性不存在，则说明是在添加新属性，否则是设置已有属性
            const type = Array.isArray(target)
            // 如果代理目标是数组，则检测被设置的索引值是否小于数组长度 
            ? Number(key) < target.length ? 'SET' : 'ADD'
            : Object.prototype.hasOwnProperty.call(target, key) ? 'SET' : 'ADD'

            // 设置属性值
            const res = Reflect.set(target, key, newVal, receiver)

            if (target === receiver.raw) {
                // 比较新值与旧值，不全等的时候才触发响应
                if (oldVal !== newVal && (oldVal === oldVal || newVal === newVal)) {
                    // 把副作用函数从桶里取出并执行
                    trigger(target, key, type, newVal)
                }
            }

            // 返回true表示设置操作成功
            return res
        },
        // 拦截in操作符的操作
        has(target, key) {
            // 将副作用函数activeEffect添加到存储副作用函数的桶中
            track(target, key)

            // 返回属性值
            return Reflect.has(target, key)
        },
        // 拦截for...in循环操作
        ownKeys(target) {
            // 将副作用函数与 ITERATE_KEY 关联
            track(target, Array.isArray(target) ? 'length' : ITERATE_KEY)

            // 返回属性值
            return Reflect.ownKeys(target)
        },
        // 拦截删除操作
        deleteProperty(target, key) {
            if (isReadOnly) {
                console.log(`属性${key}是只读的`)
                return true
            }
            // 检测被操作的属性是否是对象自己的属性
            const hadKey = Object.prototype.hasOwnProperty.call(target, key)
            
            const res = Reflect.deleteProperty(target, key)

            if (res && hadKey) {
                // 只有当被删除的属性是对象自己的属性并成功删除时，才触发更新
                trigger(target, key, 'DELETE')
            }
            return res
        }
    })
}

export const reactive = (obj) => {
    return createReactive(obj)
}

export const shallowReactive = (obj) => {
    return createReactive(obj, true)
} 

export const readOnly = (obj) => {
    return createReactive(obj, false, true)
}

export const shallowReadonly = (obj) => {
    return createReactive(obj, true, true)
}