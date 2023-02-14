---
title: 封装成vue组件库
date: 2023-02-08 17:08:09
sidebar: auto
author: Smq
tags:
  - 封装
categories:
  - 总结
description: 封装成vue组件库
---

# 封装成vue组件库

::: tip 前言
封装成vue组件库
:::

## 1. 封装成ui组件库
> 我们在前面已经将组件全部封装完毕了，现在我们要将组件打包成组件库，上传到github上。
> 由于是模仿element-ui进行的组件封装，所以在发布时也是用element-ui的打包结构。

## 2. 目录调整
我们新建一个vue项目，并且在根目录创建两个文件夹就packages和examples。
- packages：用于存放所有的组件
- examples：用于进行测试
  <br /><br />
  我们将之前写好的组件以及字体图标copy到新建项目的packages路径下，
  将App.vue和main.js（以及测试的业务组件views）放到examples路径下。其实一个单纯的组件库是不需要examples路径的，
  这样设计是为了以后我们封装新的组件时，便于测试。并且我们将原来的src文件删除。<br/>
  ![](https://cdn.jsdelivr.net/gh/abander/img@main/vuepress-theme-vdoing/20220428113825.png)

## 3. 配置vue.config.js
> 我们在项目根目录下创建vue.config.js文件，并进行如下配置。
我们通过设置entry属性将入口文件设置为examps路径下的main.js文件
我们再通过chainWebpack对于项目进行配置，使用babel处理可以将高版本语法转成低版本语法，在我们封装组件库时，这部分配置可以直接复制使用。
### 3.1. 第一种
```js
const path = require('path')
module.exports = {
  pages:{
    index:{
      // 修改项目入口文件
      entry:'examples/main.js',
      template:'public/index.html',
      filename:'index.html'
    }
  },
  // 扩展webpack配置,使webpages加入编译
  chainWebpack: config => {
    config.module
    .rule('js')
    .include.add(path.resolve(__dirname,'packages')).end()
    .use('babel')
    .loader('babel-loader')
    .tap(options => {
      return options
    })
  }
}
```
### 3.2. 第二种
> 若entry入口文件没有找到examples，就注释pages对象，选择第二种方法:
去config文件中找到webpack.base.conf.js文件找到entry对象，进行修改入口文件
```js
entry: {
    app: './examples/main.js'
  }
```

## 4. 解决static报错
> 在根文件夹下创建static文件即可

## 5. install方法
> 安装vue.js插件，如果插件使一个对象，那么必须提供install方法。
此时，我们需要在packages路径下，新建一个index.js文件，用于声明install对象。
- 我们将所有的组件和字体图标引入到index.js文件中
- 声明conpoments数组，将组件全部放到这个数组中
- 定义install方法，在Vue中注册所有的组件
- 判断是否直接引入了文件，如果引入了，则不需要调用Vue.use()方法
- 导出install对象
```js
// 整个包的入口
// 统一导出
// 导出颜色选择器组件
import Button from './button'
import Dialog from './dialog'
import Input from './input'
import Checkbox from './checkbox'
import Radio from './radio'
import RadioGroup from './radio-group'
import Switch from './switch'
import CheckboxGroup from './checkbox-group'
import Form from './form'
import FormItem from './form-item'
//import './fonts/iconfont.css'
import './fonts/btn_icon/iconfont.css'
import './fonts/dialog_icon/iconfont.css'
import './fonts/input_icon/iconfont.css'

const components = [
  Button,
  Dialog,
  Input,
  Checkbox,
  Radio,
  RadioGroup,
  Switch,
  CheckboxGroup,
  Form,
  FormItem
]
// 定义install方法
const install = function (Vue) {
  // 注册所有的组件
  components.forEach(component => {
    Vue.component(component.name, component)
  })
}
// 判断是否直接引入文件，如果是，就不用调用Vue.use()
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}
// 导出install方法
export default {
  install
}
```

## 6. main.js文件中引入pachages
```js
import Vue from 'vue'
import App from './App'
/*import './assets/fonts/btn_icon/iconfont.css'
import './assets/fonts/dialog_icon/iconfont.css'
import './assets/fonts/input_icon/iconfont.css'*/
/*引入packages*/
import hhhUI from '../packages'
Vue.use(hhhUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
```

## 7. 在APP.vue文件中进行测试效果，测试完成只留`<div id='app'></div>‘
```vue
<template>
  <div id="app">
<!--    <router-view></router-view>-->
    <hhh-button type="primary" clearable>按钮</hhh-button>
    <hhh-input  placeholder="请输入" v-model="username" type="password" show-password></hhh-input>
    <hhh-input  placeholder="请输入" v-model="username" clearable></hhh-input>
  </div>
</template>
<script>
export default {
  name: 'App',
  data(){
    return{
      username:''
    }
  }
}
</script>
<style></style>
```

## 8. 打包组件库
### 8.1. package.json
> 构建目标的命令：node build/build.js --target lib。
> 我们在package.json文件中的script下加入该条指令，并且命名为lib，
> 需要注意的是，我们需要在打包指令后面加上需要打包的路径，这里我们指定为 packages/index.js 。
```json
{
  "scripts": {
    "dev": "webpack-dev-server --inline --progress --config build/webpack.dev.conf.js",
    "start": "npm run dev",
    "unit": "jest --config test/unit/jest.conf.js --coverage",
    "e2e": "node test/e2e/runner.js",
    "build": "node build/build.js",
    "lib": "node build/build.js --target lib packages/index.js"
  }
}
```

### 8.2. npm run lib
> 我们在终端中使用lib（npm run lib）命令就可以对packages/index.js指定的组件进行打包了。
> 打包完成后，会默认生成一个名为dist的路径，我们的打包文件就在这个路径下。
### 8.3. 如图
![](https://cdn.jsdelivr.net/gh/abander/img@main/vuepress-theme-vdoing/20220428153857.png)

## 9. 组件库上传前的准备工作
### 9.1. README.md
> 将README.md文件中的内容进行处理，我的处理方式是将原来的内容全部删除，新增了项目介绍和个人介绍：
```markdown
# hhh-ui

- 本项目仅作为vue组件封装的练习参考

- 初始化vue项目
  vue created demo

- 安装组件库
  npm add hhh-ui

- 全局导入<br />
  import hhhUI form 'hhh-ui'<br />
  import 'hhh-ui/lib/hhh.css'<br />
  Vue.use(hhhUI)
```
### 9.2. 在package.json文件中声明了个人信息
```json
{
  "author": {
    "name": "smq",
    "github":"https://github.com/ui/hhh-ui"
  }
}
```

## 10. github管理项目
### 10.1. 创建仓库
> 我们使用github管理项目，首先要有一个github的账号，这部分不多做介绍了。
在有账号的情况下，我们到自己账号的仓库中新建一个仓库，来保存我们本次的项目代码。
![](https://cdn.jsdelivr.net/gh/abander/img@main/vuepress-theme-vdoing/20220428154343.png)
### 10.2. 上传仓库
- git init 初始化仓库
- git status命令查看git状态
- git add命令提交路径下文件
- git commit -m '上传组件'命令填写上传描述
- git remote add origin 仓库
- git push -u origin master

## 11. 组件库上传到npm
### 11.1. 设置package.json中的配置项
- 如果想把包发布到npm上，package.json中的private必须为fasle，我们需要将其设置位公有的包："private": false,
- 并且name必须为npm上没有的包，否则不能上传
- 同时我们可以指定入口文件  "main": "dist/hhh-ui-upload.umd.min.js"
-  版本修改："version": "0.1.0",
```json
{
  "name": "one-ui-weizhuren",
  "version": "0.1.0",
  "private": false,
  "main": "dist/one-ui-upload.umd.min.js"
}
```
### 11.2. 根目录下增加一个.npmigore文件
> 这个文件的作用是将一些不需要上传到npm的路径、文件进行忽略，我们在上传到npm时就不会把这部分上传了。
> 因为我们已经将项目打包好了，所以我们只用上传dist路径下的打包文件，不需要上传源码了。
```markdown
# 忽略目录
examples/
packages/
public/
 
# 忽略指定文件
vue.config.js
babel.config.js
*.map
```
### 11.3. 上传到npm
- 如果安装了nrm，需要保证当前的源时是npm。(nrm ls查看 nrm use npm切换源)
- 使用npm login 登录 ，注意 密码是密文，不会显示
- 使用npm publish命令直接发布到npm上
```markdown
D:\code\hhh-ui>npm login
Username: abander
Password:*********
Email: (this IS public) *********
npm notice Please check your email for a one-time password (OTP)
Enter one-time password from your authenticator app: 89155594
Logged in as abander on https://registry.npmjs.org/.
D:\code\hhh-ui>npm publish
```
## 12. 测试npm上传结果
### 12.1. 进入npm官网直接搜索name属性指定的包名就可以找到了
![](https://cdn.jsdelivr.net/gh/abander/img@main/vuepress-theme-vdoing/20220428170722.png)
### 12.2. 将组件库下载到本地项目中
> 在项目路径下，终端中输入npm add one-ui-weizhuren，
> 将我们上传的包下载下来我们就可以在项目的node——modules路径下找到这个包了。
### 12.3. 使用one-ui
> 在main.js中导入组件和组件依赖的样式
```js
import Vue from 'vue'
import App from './App.vue'
import hhhUI from 'hhh-ui-smq'
import 'hhh-ui-smq/dist/hhh-ui-upload.css'
 
Vue.config.productionTip = false
Vue.use(OneUI)
new Vue({
  render: h => h(App)
}).$mount('#app')
```
### 12.4. 我们在App.vue中使用组件，查看是否可行
```vue
<template>
  <div id="app">
    <one-button type="primary">确认</one-button>
  </div>
</template>
```



