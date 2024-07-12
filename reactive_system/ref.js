import { reactive } from "./reactive"

export const ref = (val) => {
    const wrapper = {
        value:val
    }

    Object.defineProperty(wrapper, '__v_isRef', { value: true })

    return reactive(wrapper)
}

export const toRef = (obj, key) => {
    const wrapper = {
        get value() {
            return obj[key]
        },
        // 允许设置值
        set value(val) {
            obj[key] = val
        }
    }

    Object.defineProperty(wrapper, '__v_isRef', { value: true })

    return wrapper
}

export const toRefs = (obj) => {
    const ret = {}
    // 使用for ... in 循环逐个调用 toRef 完成转换
    for (const key in obj) {
        ret[key] = toRef(obj, key)
    }

    return ret
}

export const proxyRefs = (target) => {
    return new Proxy(target, {
        get(target, key, receiver) {
            const value = Reflect.get(target, key, receiver)
            // 自动脱 ref 实现：如果读取的值是 ref，则返回它的 value 属性值
            return value.__v_isRef ? value.value : value
        },
        set(target, key, newValue, receiver) {
            // 读取真实值
            const value = target[key]
            // 如果值是Ref，则设置其对应的value属性值
            if(value.__v_isRef) {
                value.value = newValue
                return true
            }
            return Reflect.set(target, key, newValue, receiver)
        }
    })
}