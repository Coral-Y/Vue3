import {  track, trigger, ITERATE_KEY } from './index'

const reactive = (obj) => {
    return new Proxy(obj, {    
        // 拦截读取操作
        get(target, key, receiver) {
            // 代理对象可以通过 raw 属性访问原始数据
            if (key === 'raw') {
                return target
            }
            // 将副作用函数activeEffect添加到存储副作用函数的桶中
            track(target, key)

            // 返回属性值
            return Reflect.get(target, key, receiver)
        },
        // 拦截设置操作
        set(target, key, newVal, receiver) {
            // 先获取旧值
            const oldVal = target[key]

            // 如果属性不存在，则说明是在添加新属性，否则是设置已有属性
            const type = Object.prototype.hasOwnProperty.call(target, key) ? 'SET' : 'ADD'

            // 设置属性值
            const res = Reflect.set(target, key, newVal, receiver)

            if (target === receiver.raw) {
                // 比较新值与旧值，不全等的时候才触发响应
                if (oldVal !== newVal && (oldVal === oldVal || newVal === newVal)) {
                    // 把副作用函数从桶里取出并执行
                    trigger(target, key, type)
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
            track(target, ITERATE_KEY)

            // 返回属性值
            return Reflect.ownKeys(target)
        },
        // 拦截删除操作
        deleteProperty(target, key) {
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

export default reactive