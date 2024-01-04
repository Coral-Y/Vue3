// 解析器
import parseChildren from "./tools/parseChildren";
import { TextModes } from "./constant";

export default function (str) {
  // 定义上下文对象
  const context = {
    // source是模板内容，用于在解析过程中进行消费
    source: str,
    // 解析器当前处于的文本模式，初始模式为DATA
    mode: TextModes.DATA,
    // 消费指定数量的字符
    advanceBy(num) {
      context.source = context.source.slice(num);
    },
    // 消费空白字符
    advanceSpaces() {
      // 匹配空白字符
      const match = /^[\t\r\n\f ]+/.exec(context.source);
      if (match) {
        // 消费空白字符
        context.advanceBy(match[0].length);
      }
    },
  };
  // 调用parseChildren函数开始解析， 它返回解析后得到的子节点
  const nodes = parseChildren(context, []);

  return {
    type: "Root",
    children: nodes,
  };
}
