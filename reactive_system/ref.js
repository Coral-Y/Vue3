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