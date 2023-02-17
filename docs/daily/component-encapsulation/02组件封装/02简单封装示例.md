---
title: 简单封装示例
date: 2023-02-08 17:08:09
sidebar: auto
author: Smq
tags:
  - 封装
categories:
  - 总结
description: 简单封装示例
---

# 简单封装示例

::: tip 前言
简单封装示例
:::

## 1. 使用vue脚手架初始化一个项目
使用vue init webpack hhh-ui（项目名称），创建一个名为hhh-ui的项目。
按照自己的习惯设置脚手架风格，这里不多做介绍。
脚手架搭建完毕后，将App.vue文件下的自带内容清理一下，为后续开发做准备。
## 2. 如何封装，注册和使用一个组件
> 原视频所有测试是在APP.vue文件中测试的，本人在views文件夹下进行的测试，其余基本相同
### 2.1. 首先
在componet下创建一个button.vue的文件，放置button组件代码。
创建一个组建的button组件，并且指定name为hhhButton。
```vue
<template>
  <button class="hhh-button">按钮组件</button>
</template>
<script>
export default {
  name: 'hhhButton'
}
</script>
<style lang="scss"></style>
```
### 2.2. 其次
#### 2.2.1. 视频中操作
创建组件完成后，不能在项目中直接使用，需要到main.js中注册才可以使用。
```js
import Vue from 'vue'
import App from './App.vue'
// 第一步：导入button组件
import hhhButton from './components/button.vue'
Vue.config.productionTip = false
// 第二步：注册组件,设置(组件名，组件)
Vue.component(hhhButton.name, hhhButton)
new Vue({
  render: h => h(App)
}).$mount('#app')
```
#### 2.2.2. 本人操作
在views下创建一个btn.vue文件，放置测试代码
```vue
<script>
import hhhButton from '../components/button.vue'
export default {
  name: "btn",
  components:{hhhButton}
}
</script>
<style lang="scss"></style>
```
### 2.3. 最后
注册完成后，组件就可以在项目中使用了。
```vue
<template>
  <div>
    <hhh-button></hhh-button>
  </div>
</template>
```
