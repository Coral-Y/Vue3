export default function (ast) {
  const context = {
    currentNode: null,
    parent: null,
    replaceNode(node) {
      context.currentNode = node;
      context.parent.children[context.childIndex] = node;
    },
    removeNode() {
      if (context.parent) {
        context.parent.children.splice(context.childIndex, 1);
        currentNode = null;
      }
    },
    nodeTransforms: {
      transformElement,
      transformText,
    },
  };

  traverseNode(ast, context);
}

function traverseNode(ast, context) {
  // 设置当前转换的节点信息
  context.currentNode = ast;
  // 退出阶段的回调函数数组
  const exitFns = [];

  // context.nodeTransforms  Array<转换函数>
  const transforms = context.nodeTransforms;
  for (let i = 0; i < transforms.length; i++) {
    // 转换中存在父节点的操作必须等待子节点全部转换完毕后再执行的情况
    // 将当前节点currentNode和context都传递给nodeTransforms中注册的回调函数
    // 转换函数可以返回另一个函数，该函数即为退出阶段的回调函数
    const onExit = transforms[i](context.currentNode, context);
    if (onExit) {
      // 将退出阶段的回调函数添加到exitFns数组中
      exitFns.push(onExit);
    }
    // 每个转换函数都有可能移除节点，所以每个转换函数执行完毕后都应该检查当前节点是否被移除
    if (!context.currentNode) {
      return;
    }
  }

  const children = context.currentNode.children;
  if (children) {
    for (let i = 0; i < children.length; i++) {
      // 递归调用前，将当前节点设置为父节点
      context.parent = context.currentNode;
      // 设置位置索引
      context.childIndex = i;
      // 递归调用时透传context
      traverseNode(children[i], context);
    }
  }

  // 反序执行exitFns中的回调函数
  for (let i = exitFns.length; i > 0; i--) {
    exitFns[i]();
  }
}
