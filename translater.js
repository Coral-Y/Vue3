// 转换文本节点
function transformText(node) {
  if (node.type !== "Text") {
    return;
  }
  // 文本节点对应的Javascript AST 节点就是一个字符串字面量
  node.jsNode = createStringLiteral(node.content);
}

// 转换标签节点
function transformElement(node) {
  return () => {
    if (node.type !== "Element") {
      return;
    }

    // 1、创建h函数调用语句
    const callExp = createCallExpression("h", [createStringLiteral(node.tag)]);
    // 2、处理h函数调用的参数
    node.children.length === 1
      ? callExp.arguments.push(node.children[0].jsNode)
      : callExp.arguments.push(
          createArrayExpression(node.children.map((c) => c.jsNode)),
        );

    // 3、将当前标签节点对应的JavaScript AST添加到jsNode属性下
    node.jsNode = callExp;
  };
}

// 转换Root根节点
function transformRoot(node) {
  return () => {
    if (node.type !== "Root") {
      return;
    }

    // node是根节点，根节点的第一个子节点就是模板的根节点
    const vnodeJSAST = node.children[0].jsNode;

    // 创建render函数的声明语句节点
    node.jsNode = {
      type: "FunctionDecl",
      id: { type: "Identifier", name: "render" },
      params: [],
      body: [
        {
          type: "ReturnStatement",
          return: vnodeJSAST,
        },
      ],
    };
  };
}

// 创建StringLiteral节点
function createStringLiteral(value) {
  return {
    type: "StringLiteral",
    value,
  };
}

// 创建Identifier节点
function createIdentifier(name) {
  return {
    type: "Identifier",
    name,
  };
}

// 创建ArrayExpression节点
function createArrayExpression(elements) {
  return {
    type: "ArrayExpression",
    elements,
  };
}

// 创建CallExpression节点
function createCallExpression(callee, params) {
  return {
    type: "CallExpression",
    callee: createIdentifier(callee),
    arguments: params,
  };
}
