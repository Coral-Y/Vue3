import { insert, createText, setText } from "../tools/domOpertion";
import unmount from "../tools/unmount";
import mountElement from "../tools/mountElement";
import patchElement from "./tools/patchElement";
import patchChildren from "./tools/patchChildren";

const Text = Symbol(); // 文本节点的type标识
const Fragment = Symbol(); // 多根节点模板的type标识

/**
 * 渲染核心
 *
 * @export
 * @param {*} n1 旧vnode
 * @param {*} n2 新vnode
 * @param {*} container 容器
 * @param {*} anchor 锚点
 */
export default function (n1, n2, container, anchor) {
  if (n1 && n1.type !== n2.type) {
    // 新旧vnode类型不同，不存咋打补丁的意义，卸载旧vnode
    unmount(n1);
    n1 = null;
  }

  // 代码运行到这里说明n1 n2所描述的内容相同
  const { type } = n2;
  if (typeof type === "string") {
    // 普通标签元素
    if (!n1) {
      // 挂载
      mountElement(n2, container, anchor);
    } else {
      // 更新
      patchElement(n1, n2);
    }
  } else if (type === Text) {
    // 文本节点
    if (!n1) {
      // 没有旧节点，直接挂载
      const el = (n2.el = createText(n2.children));
      // 将文本节点插入到容器中
      insert(el, container);
    } else {
      const el = (n2.el = n1.el);
      if (n2.children !== n1.children) {
        setText(el, n2.children);
      }
    }
  } else if (type === Fragment) {
    // 多根节点模板
    if (!n1) {
      // 不存在旧vnode，则将children逐个挂载
      n2.children.forEach((c) => patch(null, c, container));
    } else {
      // 存在则更新
      patchChildren(n1, n2, container);
    }
  } else if (typeof type === "object") {
    // 组件
  }
}
