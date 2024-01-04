// 创建元素
export const createElement = (tag) => {
  return document.createElement(tag);
};

// 设置元素的文本节点
export const setElementText = (el, text) => {
  el.textContent = text;
};

// 在指定的parent下添加指定元素
export const insert = (el, parent, anchor = null) => {
  parent.insertBefore(el, anchor);
};

// 创建文本节点
export const createText = (text) => document.createTextNode(text);

// 设置文本节点内容
export const setText = (el, text) => {
  el.nodeValue = text;
};

// HTML Attributes指的是定义在HTML标签上的属性
// DOM Properties指的是DOM对象身上的属性
// 浏览器解析HTML代码后会创建一个与之相符的DOM元素对象，但是DOM Properties与HTML Attributes的名字并不总是一样
// 实际上HTML Attributes的作用是设置与之对应的DOM Properties的初始值

// 是否通过DOM Propertise设置元素属性
const shouldSetAsProps = (el, key, value) => {
  if (key === "form" && el.tagName === "INPUT") {
    return false;
  }
  return key in el;
};

// 设置元素属性
export const patchProps = (el, key, preValue, nextValue) => {
  if (/^on/.test(key)) {
    // 事件处理
    // 定义el._vei为一个对象，存在事件名称到事件处理函数的映射
    const invokers = el._vei || (el._vei = {});

    // 根据事件名称获取invoker
    let invoker = invokers[key];
    // 获取事件名称
    const name = key.slice(2).toLowerCase();

    if (nextValue) {
      if (!invoker) {
        // 伪造一个invoker缓存到el._vei[key]下。避免覆盖
        invoker = el._vei[key] = (e) => {
          // e.timaStamp是事件发生的时间，如果事件发生时间早于事件处理函数绑定的时间，则不执行
          if (e.timaStamp < invoker.attached) return;
          // 如果是数组，则遍历并逐个调用事件处理函数
          if (Array.isArray(nextValue)) {
            invoker.value.forEach((fn) => fn(e));
          } else {
            // 否则直接作为函数调用
            invoker.value(e);
          }
        };
        // 将真正的事件处理函数赋值给invoker.value
        invoker.value = nextValue;
        // 存储事件处理函数绑定的时间
        invoker.attached = performance.now();
        // 绑定事件
        el.addEventListener(name, invoker);
      } else {
        // 如果存在则更新
        invoker.value = nextValue;
      }
    } else if (invoker) {
      // 新的事件绑定函数不存在，之前的存在，则移除绑定
      el.removeEventListener(name, invoker);
    }
  } else if (key === "class") {
    // class处理
    el.className = nextValue || "";
  } else if (shouldSetAsProps(el, key, nextValue)) {
    const type = typeof el[key];
    if (type === "boolean" && nextValue === "") {
      el[key] = true;
    } else {
      el[key] = nextValue;
    }
  } else {
    el.setAttribute(key, nextValue);
  }
};
