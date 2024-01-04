import { genNode } from "./tools";

export default function (node) {
  // 上下文对象，维护代码生成过程中程序的运行状态
  const context = {
    // 存储最终生成的渲染函数代码
    code: "",
    // 在生成代码时，通过调用push函数完成代码的拼接
    push(code) {
      context.code += code;
    },
    // 当前缩进级别
    currentIndent: 0,
    // 换行
    newline() {
      context.code += "\n" + `  `.reapeat(currentIndent);
    },
    // 缩进
    indent() {
      context.currentIndent++;
      context.newline();
    },
    // 取消缩进
    deIndent() {
      context.currentIndent--;
      context.newline();
    },
  };

  genNode(node, context);

  // 返回渲染函数代码
  return context.code;
}
