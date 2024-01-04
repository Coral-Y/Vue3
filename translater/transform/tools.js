// 创建StringLiteral节点
export const createStringLiteral = function (value) {
  return {
    type: "StringLiteral",
    value,
  };
};

// 创建Identifier节点
export const createIdentifier = function (name) {
  return {
    type: "Identifier",
    name,
  };
};

// 创建ArrayExpression节点
export const createArrayExpression = (elements) => {
  return {
    type: "ArrayExpression",
    elements,
  };
};

// 创建CallExpression节点
export const createCallExpression = (callee, params) => {
  return {
    type: "CallExpression",
    callee: createIdentifier(callee),
    arguments: params,
  };
};

// 打印当前AST中节点的信息
export const dump = (node, indent = 0) => {
  // 节点类型
  const type = node.type;

  const desc =
    node.type === "Root"
      ? ""
      : node.type === "Element"
        ? node.tag
        : node.content;

  console.log(`${"-".repeat(indent)}${type}: ${desc}`);

  // 递归地打印子节点
  if (node.children) {
    node.children.forEach((n) => dump(n, indent + 2));
  }
};
