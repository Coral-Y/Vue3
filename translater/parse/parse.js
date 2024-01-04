export default function (template) {
  // 对模板进行标记化
  const tokens = tokenize(template);

  // 创建Root根节点
  const root = {
    type: "Root",
    children: [],
  };

  // elementStack栈，用于维护元素间的父子关系
  const elementStack = [root];

  // 循环扫描tokens，直到所有的token都被扫描完毕
  while (tokens.length) {
    // 获取当前栈顶节点作为父节点
    const parent = elementStack[elementStack.length - 1];
    // 当前扫描的token
    const t = token[0];
    switch (t.type) {
      case "tag":
        // 如果是开始标签，创建Element类型的AST节点
        const elementNode = {
          type: "Element",
          tag: t.name,
          children: [],
        };
        // 添加到父节点的children中
        parent.children.push(elementNode);
        // 将当前节点压入栈
        elementStack.push(elementNode);
        break;
      case "text":
        // 如果是文本节点，创建Text类型的AST节点
        const textNode = {
          type: "Text",
          content: t.content,
        };
        // 添加到父节点的children中
        parent.children.push(textNode);
        break;
      case "tagEnd":
        // 如果是结束标签，将栈顶节点弹出
        elementStack.pop();
        break;
    }
    // 消费已经扫描过的token
    tokens.shift();
  }
  return root;
}
