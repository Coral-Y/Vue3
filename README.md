# usage
1. 安装依赖
``` shell
npm install
```

2. 配置`package.json`的运行命令，指定运行文件
``` json
{
  "scripts": {
    "start": "npx babel-node reactive_system/index.js"
  },
}
```

3. 可以根据自己的需求，更改目录下的`index.js`文件中的示例内容

# Vue3原理

## 响应系统 reactive system
工作原理：
- 当**读取**操作发生时，将副作用函数收集到“桶”里
- 当**设置**操作发生时，从“桶”中取出副作用函数并执行

## 渲染器 renderer
渲染器的作用是：把虚拟DOM渲染为真实DOM

## 编译器 compiler
编译器的作用是：将模板编译为渲染函数
虚拟DOM是为了最小化找出差异这一步的性能消耗


# 相关概念
副作用函数：会产生副作用的函数，即会直接或间接影响其他函数的执行
挂载(mount)：渲染器吧虚拟DOM节点渲染为真实DOM节点的过程
