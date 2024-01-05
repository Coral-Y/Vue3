/**
 *卸载
* 有机会调用绑定在DOM元素上的指令钩子函数
*
* @param {*} vnode 需卸载的节点
* @return {*}
*/
export default function (vnode) {
  if (vnode.type === Fragment) {
    vnode.children.forEach((c) => unmount(c));
    return;
  }
  const parent = vnode.el.parentNode;
  if (parent) {
    parent.removeChild(vnode.el);
  }
}
