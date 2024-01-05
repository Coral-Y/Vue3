import { setElementText, patchProps, insert } from "./domOpertion";
import patch from "../patch/index";

/**
 *挂载元素
*
* @param {*} vnode 需挂载的虚拟DOM
* @param {*} container 容器
* @param {*} anchor 锚点
*/
export default function (vnode, container, anchor) {
  // 建立vnode与真实DOM之间的联系
  const el = (vnode.el = createElement(vnode.type));

  if (typeof vnode.children === "string") {
    setElementText(vnode.children);
  } else if (Array.isArray(vnode.children)) {
    // 存在子节点
    vnode.children.forEach((child) => {
      patch(null, child, el);
    });
  }

  if (vnode.props) {
    for (const key in vnode.props) {
      patchProps(el, key, null, vnode.props[key]);
    }
  }

  insert(el, container, anchor);
}
