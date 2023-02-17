---
title: Common.js 和 ES6 module
date: 2022-12-16 15:32:09
sidebar: auto
author: Zzh
tags:
  - Common.js
  - ES6module
description: 前端模块化方案 Commonjs 和 Es Module
---

# Common.js 和 ES6 module

## 问题
早期 JavaScript 开发很容易存在全局污染和依赖管理混乱问题。

## 模块化的进程
***
### 全局function模式 : 将不同的功能封装成不同的全局函数
  * 编码: 将不同的功能封装成不同的全局函数
  * 问题: 污染全局命名空间, 容易引起命名冲突或数据不安全，而且模块成员之间看不出直接关系

```js
function m1(){
  //...
}
function m2(){
  //...
}
```

### namespace模式 : 简单对象封装
   * 作用: 减少了全局变量，解决命名冲突
   * 问题: 数据不安全(外部可以直接修改模块内部的数据)

```js
let myModule = {
  data: 'www.baidu.com',
  foo() {
    console.log(`foo() ${this.data}`)
  },
  bar() {
    console.log(`bar() ${this.data}`)
  }
}
myModule.data = 'other data' //能直接修改模块内部的数据
myModule.foo() // foo() other data
```

### IIFE模式：匿名函数自调用(闭包)
  * 作用: 数据是私有的, 外部只能通过暴露的方法操作
  * 编码: 将数据和行为封装到一个函数内部, 通过给window添加属性来向外暴露接口
  * 问题: 如果当前这个模块依赖另一个模块怎么办?

```js
// module.js文件
(function(window) {
  let data = 'www.baidu.com'
  //操作数据的函数
  function foo() {
    //用于暴露有函数
    console.log(`foo() ${data}`)
  }
  function bar() {
    //用于暴露有函数
    console.log(`bar() ${data}`)
    otherFun() //内部调用
  }
  function otherFun() {
    //内部私有的函数
    console.log('otherFun()')
  }
  //暴露行为
  window.myModule = { foo, bar } //ES6写法
})(window)
```

```js
// index.html文件
<script type="text/javascript" src="module.js"></script>
<script type="text/javascript">
    myModule.foo()
    myModule.bar()
    console.log(myModule.data) //undefined 不能访问模块内部数据
    myModule.data = 'xxxx' //不是修改的模块内部的data
    myModule.foo() //没有改变
</script>
```

### IIFE模式增强 : 引入依赖
```js
// module.js文件
(function(window, $) {
  let data = 'www.baidu.com'
  //操作数据的函数
  function foo() {
    //用于暴露有函数
    console.log(`foo() ${data}`)
    $('body').css('background', 'red')
  }
  function bar() {
    //用于暴露有函数
    console.log(`bar() ${data}`)
    otherFun() //内部调用
  }
  function otherFun() {
    //内部私有的函数
    console.log('otherFun()')
  }
  //暴露行为
  window.myModule = { foo, bar }
})(window, jQuery)
```

```js
 // index.html文件
  <!-- 引入的js必须有一定顺序 -->
  <script type="text/javascript" src="jquery-1.10.1.js"></script>
  <script type="text/javascript" src="module.js"></script>
  <script type="text/javascript">
    myModule.foo()
  </script>
```
这样做除了保证模块的独立性，还使得模块之间的依赖关系变得明显
***
## 模块化好处
  * 避免命名冲突(减少命名空间污染)
  * 更好的分离, 按需加载
  * 更高复用性
  * 高可维护性

## CommonJS

### 概述
Node 应用由模块组成，采用 CommonJS 模块规范。**每个文件就是一个模块，有自己的作用域。**在一个文件里面定义的变量、函数、类，都是私有的，对其他文件不可见。
在服务器端，模块的加载是运行时同步加载的；
在浏览器端，模块需要提前编译打包处理。

::: tip
所有代码都运行在模块作用域，不会污染全局作用域。
模块可以多次加载，但是只会在第一次加载时运行一次，然后运行结果就被缓存了，以后再加载，就直接读取缓存结果。要想让模块再次运行，必须清除缓存。
模块加载的顺序，按照其在代码中出现的顺序。
:::

### 基本语法
暴露模块：module.exports = value或exports.xxx = value
引入模块：require(xxx),如果是第三方模块，xxx为模块名；如果是自定义模块，xxx为模块文件路径

在 commonjs 中每一个 js 文件都是一个单独的模块，我们可以称之为 module；
该模块中，包含 CommonJS 规范的核心变量: exports、module.exports、require；
exports 和 module.exports 可以负责对模块中的内容进行导出；
require 函数可以帮助我们导入其他模块（自定义模块、系统模块、第三方库模块）中的内容；
***
::: tip CommonJS暴露的模块到底是什么?
CommonJS规范规定，每个模块内部，module变量代表当前模块。
这个变量是一个对象，它的exports属性（即module.exports）是对外的接口。加载某个模块，其实是加载该模块的module.exports属性。
:::

::: tip require命令用于加载模块文件
require命令的基本功能是，读入并执行一个JavaScript文件，然后返回该模块的exports对象。如果没有发现指定模块，会报错。
:::

### 模块加载机制
CommonJS模块的加载机制是，**输入的是被输出的值的拷贝**。也就是说，一旦输出一个值(基本类型)，模块内部的变化就影响不到这个值。

```js
// lib.js
let counter = 3;
let obj = {
    a: 1
}
function incCounter() {
    counter++;
    obj.a = 10
    console.log(counter)
}
module.exports = {
    obj,
    counter: counter,
    incCounter: incCounter,
};

```

```js
// main.js
let counter = require('./moduleA').counter;
let incCounter = require('./moduleA').incCounter;
let obj = require('./moduleA').obj;

console.log(counter);  // 3
counter = 100
console.log(obj);  // { a: 1 }
incCounter();
console.log(counter); // 100
console.log(obj);  // { a: 10 }
```
::: danger
lib.js模块内部的变化就影响不到counter了。这是因为counter是一个原始类型的值，会被缓存。若变量是个引用类型的值，则会被更改
:::

### commonjs 实现原理
每个模块文件上存在 module，exports，require三个变量，然而这三个变量是没有被定义的，
但是我们可以在 Commonjs 规范下每一个 js 模块上直接使用它们。在 nodejs 中还存在 __filename 和 __dirname 变量。
module 记录当前模块信息。
require 引入模块的方法。
exports 当前模块导出的属性

<a-image src="https://cdn.jsdelivr.net/gh/zhihao2030/note-img@main/20221216123941.png" />

在编译的过程中，实际 Commonjs 对 js 的代码块进行了首尾包装, 以上面的lib.js为例
```js
(function(exports,require,module,__filename,__dirname){
   const Exports = require('./lib.js')
    /*
        {
            obj,
            counter: counter,
            incCounter: incCounter,
        }
    */
    module.exports = Exports
})
```
::: tip
在 Commonjs 规范下模块中，会形成一个包装函数，我们写的代码将作为包装函数的执行上下文，
使用的 require ，exports ，module 本质上是通过形参的方式传递到包装函数中的。
:::

包装函数本质是
```js
function wrapper (script) {
    return '(function (exports, require, module, __filename, __dirname) {' +
        script +
        '\n})'
}

// 在模块加载的时候，会通过 runInThisContext (可以理解成 eval ) 执行 modulefunction ，传入require ，exports ，module 等参数
```
### require 文件加载流程
```js
// node.js
const fs =      require('fs')      // ①核心模块
const sayName = require('./hello.js')  //② 文件模块
const crypto =  require('crypto-js')   // ③第三方自定义模块
```
当 require 方法执行的时候，接收的唯一参数作为一个标识符 ，Commonjs 下对不同的标识符，处理流程不同，但是目的相同，都是找到对应的模块。

::: tip require 加载标识符原则
像 fs ，http ，path 等标识符，会被作为 nodejs 的核心模块。
./ 和 ../ 作为相对路径的文件模块， / 作为绝对路径的文件模块。
非路径形式也非核心模块的模块，将作为自定义模块。
:::

核心模块的处理：
核心模块的优先级仅次于缓存加载，在 Node 源码编译中，已被编译成二进制代码，所以加载核心模块，加载过程中速度最快。
***
路径形式的文件模块处理：
以./ ，../ 和 / 开始的标识符，会被当作文件模块处理。require() 方法会将路径转换成真实路径，并以真实路径作为索引，将编译后的结果缓存起来，第二次加载的时候会更快。
***
自定义模块处理
<a-image src="https://cdn.jsdelivr.net/gh/zhihao2030/note-img@main/20221216130558.png" />

###  require 模块引入与处理
::: tip
CommonJS 模块同步加载并执行模块文件，CommonJS 模块在执行阶段分析模块依赖，采用深度优先遍历（depth-first traversal），执行顺序是父 -> 子 -> 父；
:::

**module 和 Module**
`module` ：在 Node 中每一个 js 文件都是一个 module ，module 上保存了 exports 等信息之外，还有一个 loaded 表示该模块是否被加载。

为 false 表示还没有加载；
为 true 表示已经加载

`Module` ：以 nodejs 为例，整个系统运行之后，会用 Module 缓存每一个模块加载的信息。

::: tip require 大致流程
1. require 会接收一个参数——文件标识符，然后分析定位文件，分析过程我们上述已经讲到了，加下来会从 Module 上查找有没有缓存，如果有缓存，那么直接返回缓存的内容。
2. 如果没有缓存，会创建一个 module 对象，缓存到 Module 上，然后执行文件，加载完文件，将 loaded 属性设置为 true ，然后返回 module.exports 对象。借此完成模块加载流程。
3. 模块导出就是 return 这个变量的其实跟 a = b 赋值一样， 基本类型导出的是值， 引用类型导出的是引用地址。
4. exports 和 module.exports 持有相同引用，因为最后导出的是 module.exports， 所以对 exports 进行赋值会导致 exports 操作的不再是 module.exports 的引用。

注： 是先加入缓存， 后执行模块内容
:::

::: tip require
对于基本数据类型，属于复制。即会被模块缓存。同时，在另一个模块可以对该模块输出的变量重新赋值。
对于复杂数据类型，属于浅拷贝。由于两个模块引用的对象指向同一个内存空间，因此对该模块的值做修改时会影响另一个模块。
当使用require命令加载某个模块时，就会运行整个模块的代码。
当使用require命令加载同一个模块时，不会再执行该模块，而是取到缓存之中的值。也就是说，CommonJS模块无论加载多少次，都只会在第一次加载时运行一次，以后再加载，就返回第一次运行的结果，除非手动清除系统缓存。
运行时加载。
:::


### exports 和 module.exports
module.exports 本质上就是 exports， exports 只是 module.exports的引用,初始值为一个空对象
在一个 node 执行一个文件时，会给这个文件内生成一个 exports 和 module 对象， 而module又有一个 exports 属性。他们之间的关系如下图，都指向一块{}内存区域。
```js
exports = module.exports = {};
```
<a-image src="https://cdn.jsdelivr.net/gh/zhihao2030/note-img@main/20221216133403.png" />
***

## Es Module
从 ES6 开始， JavaScript 才真正意义上有自己的模块化规范
::: tip
借助 Es Module 的静态导入导出的优势，实现了 tree shaking。
Es Module 还可以 import() 懒加载方式实现代码分割。
:::

### export 正常导出，import 导入
```js

// a.js 导出
export const a = 1
export function fn () {}

// index.js 引入
import { fn,a } from './a.js'

```
::: tip
export { }， 与变量名绑定，命名导出。
import { } from 'module'， 导入 module 的命名导出 ，module 为如上的 ./a.js
这种情况下 import { } 内部的变量名称，要与 export { } 完全匹配。
:::

### 默认导出 export default
```js
// b.js
const a = 1
const b = 2
const c = 3

export default {
    a,
    b,
    c
}

// index.js
import module from './b.js'

```
::: tip
`export default anything` 导入 module 的默认导出。 anything 可以是函数，属性方法，或者对象。
对于引入默认导出的模块，import anyName from 'module'， anyName 可以是自定义名称。
:::

### 重命名导入
```js

// index.js
import { fn as addFn, a } from './a.js'

```

### 重定向导出
```js

// 把当前模块作为一个中转站，一方面引入 module 内的属性，然后把属性再给导出去。
export * from 'a.js' // 第一种方式
export { fn, a } from 'a.js' // 第二种方式
export {   fn as addFn ,  a } from 'a.js' //第三种方式

```

### 无需导入模块，只运行模块
```js

import('xxxx')

```
::: tip
执行 module 不导出值 多次调用 module 只运行一次
:::

### 动态导入
::: tip
import() 可以动态使用，加载模块。
import() 返回一个 Promise 对象， 返回的 Promise 的 then 成功回调中，可以获取模块的加载成功信息。
import() 返回一个 Promise ，成功回调 then 中可以获取模块对应的信息。 name 对应 name 属性， default 代表 export default 。__esModule 为 es module 的标识。
:::


<a-image src="https://cdn.jsdelivr.net/gh/zhihao2030/note-img@main/20221216140842.png" />

```js

const promise = import('module')

```

### ES6 module 特性
**1. 静态语法**
ES6 module 的引入和导出是静态的，import 会自动提升到代码的顶层 ，import , export 不能放在块级作用域或条件语句中。
这种静态语法，在编译过程中确定了导入和导出的关系，所以更方便去查找依赖，更方便去 `tree shaking`

**2. 执行特性**
ES6 module 和 Common.js 一样，对于相同的 js 文件，会保存静态属性。 （相同模块只引用一次）
但是与 Common.js 不同的是 ，CommonJS 模块同步加载并执行模块文件，ES6 模块提前加载并执行模块文件，
ES6 模块在预处理阶段分析模块依赖，在执行阶段执行模块，两个阶段都采用深度优先遍历，执行顺序是子 -> 父

::: tip
使用 import 被导入的模块运行在严格模式下。
使用 import 被导入的变量是只读的，可以理解默认为 const 装饰，无法被赋值
使用 import 被导入的变量是与原变量绑定/引用的，可以理解为 import 导入的变量无论是否为基本类型都是引用传递。
:::



<a-card hoverable title="Commonjs 总结">
<p>CommonJS 模块输出的是一个值的拷贝，简单来说就是把导出值复制一份，放到一块新的内存</p>
<p>CommonJS 模块由 JS 运行时实现。</p>
<p>CommonJs 是单个值导出，本质上导出的就是 exports 属性。</p>
<p>CommonJS 是可以动态加载的，对每一个加载都存在缓存，可以有效的解决循环引用问题。（require上的cache）</p>
<p>CommonJS 模块同步加载并执行模块文件。</p>
</a-card>
    <a-divider />
<a-card hoverable title="ES module 总结">
<p>ES6 Module 静态的，不能放在块级作用域内，代码发生在编译时。</p>
<p>ES6 Module 可以导出多个属性和方法，可以单个导入导出，混合导入导出。</p>
<p>ES6 模块提前加载并执行模块文件</p>
<p>ES6 模块是动态引用，并且不会缓存值，模块里面的变量绑定其所在的模块。</p>
<p>ES6模块中的值属于【动态只读引用】。</p>
<p>只读：即不允许修改引入变量的值，import的变量是只读的，不论是基本数据类型还是复杂数据类型。当模块遇到import命令时，就会生成一个只读引用。等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。</p>
<p>动态：原始值发生变化，import加载的值也会发生变化。不论是基本数据类型还是复杂数据类型。编译时输出接口</p>





</a-card>


参考：
1. https://juejin.cn/post/6994224541312483336
2. https://juejin.cn/post/6844903744518389768
