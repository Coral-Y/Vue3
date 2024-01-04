import { insert, setElementText } from "../../tools/domOpertion";
import unmount from "../../unmount";

/**
 * 更新子节点
 *
 * @export
 * @param {*} n1
 * @param {*} n2
 * @param {*} container
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
    const oldChildren = n1.children;
    const newChildren = n2.children;

    // 存储寻找过程中遇到的最大索引值
    let lastIndex = 0;

    // 遍历新的children
    for (let i = 0; i < newChildren; i++) {
      const newVNode = newChildren[i];
      // 标识新子节点是否存在于旧子节点中
      let find = false;
      // 遍历旧的children
      for (let j = 0; j < oldChildren; j++) {
        const oldVNode = oldChildren[j];
        // 如果找到了相同key的节点，说明可以复用，但是仍要调用patch更新
        if (newVNode.key === oldVNode.key) {
          find = true;
          patch(oldVNode, newVNode, container);
          if (j < lastIndex) {
            // 如果当前找到的节点在就children中的索引小于最大索引值，说明该节点对应的真实DOM需要移动
            // 获取newVNode的前一个vnode
            const prevVNode = newChildren[i - i];
            // 如果不存在，说明当前newVNode是第一个节点，不需要移动
            if (prevVNode) {
              // 将newVNode移动到prevVNode后面
              const anchor = prevVNode.el.nextSibling;
              insert(newVNode.el, container, anchor);
            }
          } else {
            // 如果当前找到的节点在就children中的索引不小于最大索引值，则更新lastIndex的值
            lastIndex = j;
          }
          break;
        }
      }

      // 说明当前newVNode没有在旧的一组子节点中找到可复用的节点，此时newVNode是新增节点，需要挂载
      if (!find) {
        // 获取锚点元素
        const prevVNode = newChildren[i - 1];
        let anchor = null;
        if (prevVNode) {
          // 存在前一个vnode节点，则使用它的下一个兄弟节点作为锚点元素
          anchor = prevVNode.el.nextSibling;
        } else {
          // 不存在，说明即将挂载的新节点是第一个子节点
          anchor = container.firstChild;
        }

        patch(null, newVNode, container, anchor);
      }
    }

    // 上一步的更新操作完成后，遍历旧的一组子节点
    for (let i = 0; i < oldChildren.length; i++) {
      const oldVNode = oldChildren[i];
      // 用旧节点去新的一组子节点中找具有相同key值的节点
      const has = newChildren.some((vnode) => vnode.key === oldVNode.key);
      if (!has) {
        // 不存在，说明需要删除该节点
        unmount(oldVNode);
      }
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
