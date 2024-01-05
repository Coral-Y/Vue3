export default function (n1, n2, container) {
  const oldChildren = n1.children;
  const newChildren = n2.children;

  // 四个索引值
  let oldStartIdx = 0;
  let oldEndIdx = oldChildren.length - 1;
  let newStartIdx = 0;
  let newEndIdx = newChildren.length - 1;

  // 索引指向的四个虚拟节点
  let oldStartVNode = oldChildren[oldStartIdx];
  let oldEndVNode = oldChildren[oldEndIdx];
  let newStartVNode = newChildren[newStartIdx];
  let newEndVNode = newChildren[newEndIdx];

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (!oldStartVNode) {
      oldStartVNode = oldChildren[++oldStartIdx];
    } else if (!oldEndVNode) {
      oldEndVNode = oldChildren[--oldEndIdx];
    }
    if (oldStartVNode.key === newStartVNode.key) {
      // 第一步
      patch(oldStartVNode, newStartVNode, container);
      // 更新索引
      oldStartVNode = oldChildren[++oldStartIdx];
      newStartVNode = newChildren[++newStartIdx];
    } else if (oldEndVNode.key === newEndVNode.key) {
      // 第二步
      patch(oldEndVNode, newEndVNode, container);
      // 更新索引
      oldEndVNode = oldChildren[--oldEndIdx];
      newEndVNode = newChildren[--newEndIdx];
    } else if (oldStartVNode.key === newEndVNode.key) {
      // 第三步
      patch(oldStartVNode, newEndVNode, container);
      insert(oldStartVNode.el, container, oldEndVNode.el.nextSibling);

      // 更新索引
      oldStartVNode = oldChildren[++oldStartIdx];
      newEndVNode = newChildren[--newEndIdx];
    } else if (oldEndVNode.key === newStartVNode.key) {
      // 第四步
      patch(oldEndVNode, newStartVNode, container);
      insert(oldEndVNode.el, container, oldStartVNode.el);

      // 更新索引
      oldEndVNode = oldChildren[--oldEndIdx];
      newStartVNode = newChildren[++newStartIdx];
    } else {
      // 都未命中时, 用新子节点的头节点去旧子节点中找
      const idxInOld = oldChildren.findIndex(
        (vnode) => vnode.key === newStartVNode.key,
      );
      if (idxInOld > 0) {
        // 有需要移动的节点
        const vnodeToMove = oldChildren[idxInOld];
        patch(vnodeToMove, newStartVNode, container);
        insert(vnodeToMove.el, container, oldStartVNode.el);
        oldChildren[idxInOld] = undefined;
      } else {
        // 新节点
        patch(null, newStartVNode, container, oldStartVNode.el);
      }
      newStartVNode = newChildren[++newStartIdx];
    }
  }

  if (oldStartIdx > oldEndIdx && newStartIdx <= newEndIdx) {
    // 有新节点遗留，需挂载
    for (let i = newStartIdx; i < newEndIdx; i++) {
      patch(null, newChildren[i], container, oldStartVNode.el);
    }
  } else if (newStartIdx > newEndIdx && oldStartIdx <= oldEndIdx) {
    // 有旧节点遗留，需卸载
    for (let i = oldStartIdx; i < oldEndIdx; i++) {
      unmount(oldChildren[i]);
    }
  }
}
