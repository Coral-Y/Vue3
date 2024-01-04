import parseComment from "./parseComment";
import parseElement from "./parseElement";
import parseInterpolation from "./parseInterpolation";
import parseText from "./parseText";
import { TextModes } from "../constant";

// 当解析器遇到开始标签时，会将该标签压入到父级节点栈，同时开启新的状态机。
// 当解析器遇到结束标签，并且父级节点栈中存在与该标签同名的开始标签节点时，会停止当前正在运行的状态机
const isEnd = (context, ancestors) => {
  // 当模版内容解析完毕后，停止
  if (!context.source) return true;

  // 与父级节点栈内所有节点作比较
  for (let i = ancestors.length - 1; i >= 0; --i) {
    // 如果遇到结束标签，只要父级节点栈中存在与该标签同名的开始标签节点，就停止
    if (context.source.startsWith(`</${ancestors[i].tag}`)) {
      return true;
    }
  }
};

export default function (context, ancestors) {
  // 定义nodes数组存储子节点， 是最终的返回值
  let nodes = [];
  // 从上下文对象中取得当前状态，包括模式mode和模板内容source
  const { mode, source } = context;

  // 开启while循环，只要满足条件就会一直对字符串进行解析
  while (!isEnd(context, ancestors)) {
    let node;
    // 只有DATA模式和RCDATA模式才支持插值节点的解析
    if (mode === TextModes.DATA || mode === TextModes.RCDATA) {
      // 只有DATA模式才支持标签节点的解析
      if (mode === TextModes.DATA && source[0] === "<") {
        if (source[1] === "!") {
          if (source.startsWith("<!--")) {
            // 注释
            node = parseComment(context);
          } else if (source.startsWith("<![CDATA[")) {
            // CDATA
            node = parseCDATA(context, ancestors);
          }
        } else if (source[1] === "/") {
          // 结束标签
          // 状态机缺少与之对应的开始标签
          console.log("无效的结束标签");
          continue;
        } else if (/[a-z]/i.test(source[1])) {
          // 标签
          node = parseElement(context, ancestors);
        }
      } else if (source.startsWith("{{")) {
        // 解析插值
        node = parseInterpolation(context);
      }
    }

    // node不存在，说明处于其他模式，此时一切内容都作为文本处理
    if (!node) {
      // 解析文本节点
      node = parseText(context);
    }

    nodes.push(node);
  }

  return nodes;
}
