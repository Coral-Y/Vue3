// 文本模式指的是解析器在工作时所进入的一些特殊状态，在不同的特殊状态下，解析器对文本的解析行为会有所不同
// 定义文本模式，作为状态表
export const TextModes = {
  DATA: "DATA",
  RCDATA: "RCDATA",
  RAWTEXT: "RAWTEXT",
  CDATA: "CDATA",
};
