import patch from "../patch/index";
import unmount from "./unmount";

/**
 *渲染
 *
 * @export
 * @param {*} vnode 待渲染的节点
 * @param {*} container 容器
 */
export default function (vnode, container) {
  if (vnode) {
    // 存在新vnode
    patch(container._vnode, vnode, container);
  } else {
    if (container._vnode) {
      // 存在旧vnode，不存在新vnode。卸载操作
      unmount(container._vnode);
    }
  }
  // 后续渲染中的旧vnode
  container._vnode = vnode;
}
