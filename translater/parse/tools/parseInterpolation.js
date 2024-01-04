// 解析插值
export default function (context) {
  // 消费开始界定符
  context.advanceBy("{{".length);
  // 找到结束界定符的位置索引
  const closeIndex = context.source.indexOf("}}");
  if (closeIndex < 0) {
    console.error("插值缺少结束界定符");
  }
  // 截取开始界定符与结束界定符之间的内容作为插值表达式
  const content = context.source.slice(0, closeIndex);
  // 消费表达式内容
  context.advanceBy(content.length);
  // 消费结束界定符
  context.advanceBy("}}".length);

  // 返回插值节点
  return {
    type: "Interpolation",
    content: {
      type: "Expression",
      content,
    },
  };
}
