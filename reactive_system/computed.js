import { effect, track, trigger } from './index'

const computed = (getter) => {
    // 缓存上一次计算的值
    let value
    // 标识是否需要重新计算值
    let dirty = true

    // 把getter作为副作用函数，创建一个lazy的effect
    const effectFn = effect(getter, { 
        lazy: true,
        scheduler() {
            if (!dirty) {
                dirty = true
                // 当计算属性依赖的响应式数据变化时，手动触发响应
                trigger(obj, 'value')
            }
        }
    })

    const obj = {
        get value() {
            if (dirty) {
                console.log('数据改变了')
                value = effectFn()
                dirty = false
            }
            // 当读取value时，手动调用track函数进行追踪
            track(obj, 'value')
            return value
        }
    }

    return obj
}

export default computed