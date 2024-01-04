// 为函数声明类型的节点生成对应的JavaScript代码
export const genFunctionDecl = (node, context) => {
  const { push, indent, deIndent } = context;
  push(`function ${node.id.name} (`);
  genNodeList(node.params, context);
  push(`) {`);
  indent();
  node.body.forEach((n) => genNode(n, context));
  deIndent();
  push(`}`);
};

// 为数组表达式类型的节点生成对应的JavaScript代码
export const genArrayExpression = function (node, context) {
  const { push } = context;
  // 追加方括号
  push("[");
  // 调用genNodeList为数组元素生成代码
  genNodeList(node.elements, context);
  // 补全方括号
  push("]");
};

// 为返回表达式类型的节点生成对应的JavaScript代码
export const genReturnStatement = function (node, context) {
  const { push } = context;
  // 追加return关键字和空格
  push("return ");
  // 调用genNode 递归生成返回值代码
  genNode(node.return, context);
};

// 为字符串字面量类型的节点生成对应的JavaScript代码
export const genStringLiteral = function (node, context) {
  const { push } = context;
  push(`'${node.value}'`);
};

// 为CallExpression类型的节点生成对应的JavaScript代码
export const genCallExpression = function (node, context) {
  const { push } = context;
  const { callee, argumnt: args } = context;
  // 生成函数调用代码
  push(`${callee.name} (`);
  // 调用genNodeList生成参数代码
  genNodeList(args, context);
  // 补全括号
  push(")");
};

export const genNode = (node, context) => {
  switch (node.type) {
    case "FunctionDecl":
      genFunctionDecl(node, context);
      break;
    case "ReturnStatement":
      genReturnStatement(node, context);
      break;
    case "CallExpression":
      genCallExpression(node, context);
      break;
    case "StringLiteral":
      genStringLiteral(node, context);
      break;
    case "ArrayExpression":
      genArrayExpression(node, context);
      break;
  }
};

// 接收一个节点数组，并为每一个节点递归地调用genNode函数完成代码生成工作
export const genNodeList = (nodes, context) => {
  const { push } = context;
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    genNode(node, context);
    if (i < nodes.length - 1) {
      push(`, `);
    }
  }
};
