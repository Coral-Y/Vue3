import parseChildren from "./parseChildren";
import { TextModes } from "../constant";

// 解析标签节点
const parseTag = (context, type = "start") => {
  const { advanceBy, advanceSpaces } = context;

  const match =
    type === "start"
      ? // 匹配开始标签
        /^<([a-z][^\t\r\n\f />]*)/i.exec(context.source)
      : // 匹配结束标签
        /^<\/([a-z][^\t\r\n\f />]*)/i.exec(context.source);

  const tag = match[1];
  // 消费正则表达式匹配的全部内容
  advanceBy(match[0].length);
  // 消费标签中无用的空白字符
  advanceSpaces();

  // 解析属性和指令
  const props = parseAttributes(context);

  const isSelfClosing = context.source.startsWith("/>");
  advanceBy(isSelfClosing ? 2 : 1);

  return {
    type: "Element",
    tag,
    props,
    children: [],
    isSelfClosing,
  };
};

// 解析属性和指令
const parseAttributes = (context) => {
  const { advanceBy, advanceSpaces } = context;
  // 用来存储解析过程中产生的属性节点和指令节点
  const props = [];

  // 开启while循环，消费模板内容，直到遇到标签结束部分
  while (!context.source.startsWith(">") && !context.source.startsWith("/>")) {
    // 匹配属性名称
    const match = /^[^\t\r\n\f />][^\t\r\n\f />=]*/.exec(context.source);
    // 得到属性名称
    const name = match[0];
    // 消费属性名称
    advanceBy(name.length);
    // 消费 属性名称 与 = 之间空白字符
    advanceSpaces();
    // 消费=号
    advanceBy(1);
    // 消费 = 与 属性值 之间的空白字符
    advanceSpaces();

    // 属性值
    let value = "";

    // 获取当前模板内容的第一个字符
    const quote = context.source[0];
    // 判断属性值是否被引号引用
    const isQuoted = quote === '"' || quote === "'";

    if (isQuoted) {
      // 消费引号
      advanceBy(1);
      // 获取下一个引号的索引
      const endQuoteIndex = context.source.indexOf(quote);
      if (endQuoteIndex > -1) {
        // 获取下一个引号之前的内容作为属性值
        value = context.source.slice(0, endQuoteIndex);
        // 消费属性值
        advanceBy(value.length);
        // 消费引号
        advanceBy(1);
      } else {
        // 缺少引号错误
        console.error("缺少引号");
      }
    } else {
      // 未被引号引用 下一个空白字符前的内容全部作为属性值
      const match = /^[^\t\r\n\f >]+/.exec(context.source);
      value = match[0];
      // 消费属性值
      advanceBy(value.length);
    }
    // 消费属性值后面的空白字符
    advanceSpaces();

    props.push({
      type: "Attribute",
      name,
      value,
    });
  }

  return props;
};

// 解析元素
export default function (context, ancestors) {
  const element = parseTag(context);
  if (element.isSelfClosing) return element;

  // 根据节点类型切换到正确的文本类型
  if (element.tag === "textarea" || element.tag === "title") {
    context.mode = TextModes.RCDATA;
  } else if (/style|xmp|iframe|noembed|noframes|noscript/.test(element.tag)) {
    context.mode = TextModes.RAWTEXT;
  } else {
    context.mode = TextModes.DATA;
  }

  ancestors.push(element);
  element.children = parseChildren(context, ancestors);
  ancestors.pop();

  if (context.source.startsWith(`</${element.tag}`)) {
    parseTag(context, "end");
  } else {
    // 缺少闭合标签
    console.error(`${element.tag} 标签缺少闭合标签`);
  }

  return element;
}
