// 编译器
import { dump } from "./transform/tools";
import parse from "./parse/index";

const template = `<div><p>Vue</p><p>Template</p></div>`;

const templateAST = parse(template);
dump(templateAST)
// const jsAST = transform(templateAST);
// const code = generate(jsAST);
