import patchChildren from "./patchChildren";

/**
 *更新节点
 *
 * @export
 * @param {*} n1
 * @param {*} n2
 */
export default function (n1, n2) {
  const el = (n2.el = n1.el);
  const oldProps = n1.props;
  const newProps = n2.props;

  // 更新props
  for (const key in newProps) {
    if (newProps[key] !== oldProps[key]) {
      patchProps(el, key, oldProps[key], newProps[key]);
    }
  }
  for (const key in oldProps) {
    if (!newProps[key]) {
      patchProps(el, key, oldProps[key], null);
    }
  }

  // 更新children
  patchChildren(n1, n2, el);
}
