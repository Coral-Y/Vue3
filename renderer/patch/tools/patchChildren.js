import { setElementText } from "../../tools/domOpertion";
import unmount from "../../tools/unmount";
import patchKeyedChildren from "./patchKeyedChildren";

/**
 * 更新子节点
 *
 * @export
 * @param {*} n1 旧子节点
 * @param {*} n2 新子节点
 * @param {*} container 容器
 */
export default function (n1, n2, container) {
  // 判断新子节点是否是文本节点
  if (typeof n2.children === "string") {
    // 旧子节点可能是：没有子节点，文本子节点以及一组子节点
    // 只有当旧节点为一组子节点时，才需要逐个卸载
    if (Array.isArray(n1.children)) {
      // 卸载所有旧子节点
      n1.children.forEach((c) => unmount(c));
    }
    // 将新的文本节点内容设置给容器元素
    setElementText(container, n2.children);
    // 判断新子节点是否是一组子节点
  } else if (Array.isArray(n2.children)) {
    // 判断旧子节点是否也是一组子节点
    if (Array.isArray(n1.children)) {
      // 核心Diff算法
      patchKeyedChildren(n1, n2, container);
    } else {
      // 旧子节点是文本子节点或不存在，只要将容器清空，然后逐一挂载新子节点就可以
      setElementText(container, "");
      n2.children.forEach((c) => patch(null, c, container));
    }
  } else {
    // 不存在新子节点
    if (Array.isArray(n1.children)) {
      // 逐一卸载
      n1.children.forEach((c) => unmount(c));
    } else if (typeof n1.children === "string") {
      // 清空内容
      setElementText(container, "");
    }
  }
}
