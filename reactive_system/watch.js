import { effect } from './index'

const watch = (source, cb, options = {}) => {
    let getter

    if (typeof source === 'function') {
        getter = source
    } else {
        getter = () => traverse(source)
    }

    let oldValue, newValue

    const job = () => {
        // 在scheduler中重新执行副作用函数，得到的是新值
        newValue = effectFn()
        // 数据发生变化时，调用回调函数
        cb(newValue, oldValue)
        // 更新旧值
        oldValue = newValue
    }
    
    // 开启lazy选项，并把返回值存储到effectFn中以便后续手动调用
    const effectFn = effect(
        () => getter(),
        {
            scheduler: job,
            lazy: true
        }
    )

    if (options.immediate) {
        job()
    } else {
        // 手动调用副作用函数，拿到的值就是旧值
        oldValue = effectFn()
    }
}

function traverse(value, seen = new Set()) {
    // 如果要读取的数据是原始值，或者已经被读取过了，则什么都不错
    if(typeof value !== 'object' || value === null || seen.has(value)) {
        return
    }
    // 将数据添加到seen，代表遍历地读取过了，避免死循环
    seen.add(value)
    for (const k in value) {
        traverse(value[k], seen)
    }
    return value
}

export default watch