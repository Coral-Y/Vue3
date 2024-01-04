// 解析注释
export default function (context) {
  // 消费注释的开始部分
  context.advanceBy("<!--".length);
  // 找到注释结束部分的位置索引
  const closeIndex = context.source.indexOf("->");
  // 截取注释节点的内容
  const content = context.source.slice(0, closeIndex);
  // 消费内容
  context.advanceBy(content.length);
  // 消费注释的结束部分
  context.advanceBy("-->".length);
  // 返回注释节点
  return {
    type: "Comment",
    content,
  };
}
