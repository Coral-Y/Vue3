import {createRenderer} from "./tools/render";

const vnode = {
  type: "h1",
  props: {
    id: "foo",
  },
  children: [
    {
      type: "p",
      children: "hello",
    },
  ],
};
const container = {
  type: "root",
};
const renderer = createRenderer();
// 首次渲染 挂载
// renderer.render(vnode, document.querySeelct("#app"));
// 第二次渲染 打补丁
// renderer.render(vnode2, document.querySeelct("#app"));
// 第三次渲染 卸载
// renderer.render(null, document.querySeelct("#app"));

renderer.render(vnode, container);
console.log(container)
