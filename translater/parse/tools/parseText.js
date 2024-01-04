// 解析文本
export default function (context) {
  // 文本内容的结尾索引
  let endIndex = context.source.length;
  // 寻找字符 < 的位置索引
  const itIndex = context.source.indexOf("<");
  // 寻找插值 {{ 的位置索引
  const delimiterIndex = context.source.indexOf("{{");

  // 取itIndex 和 delimiterIndex 中较小的作为新的结尾索引
  if (itIndex > -1 && itIndex < endIndex) {
    endIndex = itIndex;
  }
  if (delimiterIndex > -1 && delimiterIndex < endIndex) {
    endIndex = delimiterIndex;
  }

  // 获取文本内容
  const content = context.source.slice(0, endIndex);
  // 消耗文本内容
  context.advanceBy(content.length);

  // 返回文本节点
  return {
    type: "Text", // 节点类型
    content, // 文本内容
  };
}
