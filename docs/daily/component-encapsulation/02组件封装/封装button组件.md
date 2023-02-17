---
title: 封装button组件
date: 2023-02-08 17:08:09
sidebar: auto
author: Smq
tags:
  - 封装
categories:
  - 总结
description: 封装button组件
---

# 封装button组件

::: tip 前言
封装button组件
:::

## 1. 需要用到的知识
- 组件通讯
- 组件插槽
- props校验

## 2. 参数和事件
### 2.1 参数支持
![](https://cdn.jsdelivr.net/gh/abander/img@main/vuepress-theme-vdoing/20220419170142.png)
### 2.2. 事件支持
![](https://cdn.jsdelivr.net/gh/abander/img@main/vuepress-theme-vdoing/20220419170303.png)

## 3. button基础组件
### 3.1. 基础组件(子组件)代码
```vue
<template>
  <button class="hhh-button">
<!-- span的作用就是可以控制slot的样式  -->
    <span>
<!--凡是希望组件中内容可以灵活设置的地方，都需要用到slot插槽来自定义内容。-->
      <slot></slot>
    </span>
  </button>
</template>

<script>
export default {
  name: "hhhButton"
}
</script>

<style lang="scss" scoped>
/*button组件基础样式：*/
.hhh-button{
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #ffffff;
  border: 1px solid #dcdfe6;
  color: #606266;
  -webkit-appearance: none;
  text-align: center;
  box-sizing: border-box;
  outline: none;
  margin: 0;
  transition: 0.1s;
  font-weight: 500;
  //禁止元素的文字被选中
  -moz-user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;
  &:hover,
  &:hover{
    color: #409eff;
    border-color: #c6e2ff;
    background-color: #ecf5ff;
  }
}
</style>
```
### 3.2. 业务组件(父组件)代码
```vue
<template>
  <div>
    <hhh-button>登录</hhh-button>
    <hhh-button>删除</hhh-button>
    <hhh-button>取消</hhh-button>
  </div>
</template>
```
### 3.3. 效果
![](https://cdn.jsdelivr.net/gh/abander/img@main/vuepress-theme-vdoing/20220419170921.png)

## 4. button组件的type属性
> 让按钮支持type属性，使得按钮支持不同样式，步骤如下：
### 4.1. 第一步
> 父组件传递type属性
```vue
<template>
  <div>
    <div class="row">
      <h4>基础按钮</h4>
      <hhh-button>按钮</hhh-button>
      <hhh-button type="primary">primary按钮</hhh-button>
      <hhh-button type="success">success按钮</hhh-button>
      <hhh-button type="info">info按钮</hhh-button>
      <hhh-button type="danger">danger按钮</hhh-button>
      <hhh-button type="warning">warning按钮</hhh-button>
    </div>
  </div>
</template>
```
### 4.2. 第二步
> 子组件接收父组件传递的数据
```vue
 <script>
    export default {
      name: "hhhButton",
      //封装一个通用的组件，会对props做一个约束，props进行校验
      props:{
        type:{
          type:String,
          // 设置默认值：如果不传值，那么使用default
          default:'default'
        }
      },
      created () {
        console.log(this.type,'type') //defalut primary success info danger warning
      }
    }
</script>
```
### 4.3. 第三步
> 子组件通过绑定类名的方法动态控制样式
```vue
<template>
  <button class="hhh-button" :class="`hhh-button-${type}`">
    <span><slot></slot></span>
  </button>
</template>
```
### 4.4. 第四步
> 子组件设置不同类型样式
```vue
<style lang="scss" scoped>
/*根据type设置不同类型的样式*/
.hhh-button-primary{
  color:#fff;
  background-color: #409eff;
  border-color: #409eff;
  &:hover,
  &:focus{
    background: #66b1ff;
    background-color: #66b1ff;
    color: #fff;
  }
}
.hhh-button-success{
  color:#fff;
  background-color: #67c23a;
  border-color: #67c23a;
  &:hover,
  &:focus{
    background: #85ce61;
    background-color: #85ce61;
    color: #fff;
  }
}
.hhh-button-info{
  color:#fff;
  background-color: #909399;
  border-color: #909399;
  &:hover,
  &:focus{
    background: #a6a9ad;
    background-color: #a6a9ad;
    color: #fff;
  }
}
.hhh-button-warning{
  color:#fff;
  background-color: #e6a23c;
  border-color: #e6a23c;
  &:hover,
  &:focus{
    background: #ebb563;
    background-color: #ebb563;
    color: #fff;
  }
}
.hhh-button-danger{
  color:#fff;
  background-color: #f56c6c;
  border-color: #f56c6c;
  &:hover,
  &:focus{
    background: #f78989;
    background-color: #f78989;
    color: #fff;
  }
}
</style>
```
### 4.5. 效果如下
![](https://cdn.jsdelivr.net/gh/abander/img@main/vuepress-theme-vdoing/20220419172124.png)

## 5. button组件的plain属性
> 和type类型相同，我们只要将样式先设置好，然后通过父组件传递过来的值进行判断，就可以设置plain属性了。
### 5.1. 第一步
> 父组件传递plain属性
```vue
 <div class="row">
      <h4>朴素按钮</h4>
      <hhh-button plain>按钮</hhh-button>
      <hhh-button plain type="primary">primary按钮</hhh-button>
      <hhh-button plain type="success">success按钮</hhh-button>
      <hhh-button plain type="info">info按钮</hhh-button>
      <hhh-button plain type="danger">danger按钮</hhh-button>
      <hhh-button plain type="warning">warning按钮</hhh-button>
</div>
```
### 5.2. 第二步
> 子组件接收父组件传递的数据
```vue
<script>
   export default {
    name: "hhhButton",
    props:{
      //plain的参数类型是Boolean，默认值是false
        plain:{
            type: Boolean,
            default: false
        }
    },
}
</script>
```
### 5.3. 第三步
> 子组件通过绑定类名的方法动态控制样式。
```vue
<template>
<!-- 由于plain类型是布尔值，所以在类型中我们使用对象的形式来控制样式 -->
  <button class="hhh-button" :class="[`hhh-button-${type}`,{
    'is-plain': plain
  }]">
    <span><slot></slot></span>
  </button>
</template>
```
### 5.4. 第四步
> 子组件设置不同类型样式

```vue
<!--由于plain类型是以对象的形式在类中定义的，所以使用获取属性的方法定义样式-->
/*朴素按钮样式*/
.hhh-button.is-plain{
  &:hover,
  &:focus{
    background: #fff;
    border-color: #489eff;
    color: #409eff;
  }
}
.hhh-button-primary.is-plain{
  color: #409eff;
  background: #ecf5ff;
  &:hover,
  &:focus{
    background: #409eff;
    border-color: #409eff;
    color: #fff;
  }
}
.hhh-button-success.is-plain{
  color: #67c23a;
  background: #c2e7b0;
  &:hover,
  &:focus{
    background: #67c23a;
    border-color: #67c23a;
    color: #fff;
  }
}
.hhh-button-info.is-plain{
  color: #909399;
  background: #d3d4d6;
  &:hover,
  &:focus{
    background: #909399;
    border-color: #909399;
    color: #fff;
  }
}
.hhh-button-warning.is-plain{
  color: #e6a23c;
  background: #f5dab1;
  &:hover,
  &:focus{
    background: #e6a23c;
    border-color: #e6a23c;
    color: #fff;
  }
}
.hhh-button-danger.is-plain{
  color: #f56c6c;
  background: #fbc4c4;
  &:hover,
  &:focus{
    background: #f56c6c;
    border-color: #f56c6c;
    color: #fff;
  }
}
```
### 5.5. 效果如下
![](https://cdn.jsdelivr.net/gh/abander/img@main/vuepress-theme-vdoing/20220419173838.png)

## 6. button组件的round属性、circle属性
> 设置round属性、circle属性和plain属性的相似，只要在组件中定义好了样式，动态获取属性值即可。
### 6.1. round样式
```vue
<style lang="scss" scoped>
/*圆角按钮样式*/
.hhh-button.is-round{
    border-radius: 20px;
    padding: 12px 23px;
}
</style>
```
### 6.2. circle样式
```vue
<style lang="scss" scoped>
/*是否为圆形按钮样式*/
.hhh-button.is-circle{
    border-radius: 50%;
    padding: 12px;
}
</style>
```
### 6.3. 效果如下
![](https://cdn.jsdelivr.net/gh/abander/img@main/vuepress-theme-vdoing/20220419204803.png)

## 7. button组件的icon属性
> 在项目中使用字体图标，首先需要有字体图标，我们可以去[阿里巴巴矢量图标库](https://www.iconfont.cn/)下载。
下载时选中想要的图标添加到购物车并下载代码，然后在asset目录下新建一个fonts目录，存放我们下载到的字体图标。
>
### 7.1. 第一步
> 在main.js中引入字体图标
```js
import './assets/fonts/btn_icon/iconfont.css'
```
### 7.2. 第二步
> 将下载的字体图标css文件中的类名做修改，我将icon全部改为了hhh-icon，
> 并且将初始的iconfont类改为了[class*='hhh-icon']，当类名中有hhh-icon时使用，如下
```css
/*
把.iconfont改成.hhh-icon，最后在改成属性选择器[class*='hhh-icon']
`[属性名*=属性值]` 选择属性值中含有某值的元素的元素。
*/
[class*='hhh-icon'] {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.hhh-icon-caomei:before {
  content: "\e6c9";
}
.hhh-icon-a-li_huaban1:before {
  content: "\e6ca";
}
.hhh-icon-baixiangguo:before {
  content: "\e6cb";
}
.hhh-icon-huolongguo:before {
  content: "\e6cc";
}
.hhh-icon-yangtao:before {
  content: "\e6cd";
}
.hhh-icon-shanzhu:before {
  content: "\e6ce";
}
```
### 7.3. 第三步
> 父组件传递图标名
```vue
<div class="row">
  <h4>icon</h4>
  <hhh-button icon="caomei"></hhh-button>
  <hhh-button icon="a-li_huaban1" type="primary"></hhh-button>
  <hhh-button icon="baixiangguo" type="success">success按钮</hhh-button>
  <hhh-button icon="huolongguo" type="info">info按钮</hhh-button>
  <hhh-button icon="yangtao" type="danger">danger按钮</hhh-button>
  <hhh-button icon="shanzhu" type="warning">warning按钮</hhh-button>
</div>
```
### 7.4. 第四步
> 子组件接收并且放到图标中。使用接收到的字体图标，
> 在没有传入icon时隐藏`<i>`标签，在slot插槽没有传入值时，不显示`<span>`标签
```vue
<template>
  <button class="hhh-button" :class="[`hhh-button-${type}`,{
    'is-plain': plain,
    'is-round': round,
    'is-circle': circle,
  }]">
    <i v-if="icon" :class="`hhh-icon-${icon}`"></i>
    <!--v-if="$slots.default"的作用：用来判断是否传了插槽，如果没传入文本插槽，则不显示span内容  -->
    <!-- 为什么是$slots.default。因为我们在任何一个组件中打印this.$slots，
    可以打印所有的插槽，只要传了插槽都会走一个默认default的插槽，没传则是空 -->
    <span v-if="$slots.default"><slot></slot></span>
  </button>
</template>
<script>
export default {
    props:{
        icon: {
          type: String,
          default: ''
         }
    }
}
</script>
```
### 7.5. 第五步
> 设置icon配套样式，使图标和文字之间有一定间隔
```css
.hhh-button [class*=hhh-icon-]+span{
  margin-left: 5px;
}
```
### 7.6. 查看效果
![](https://cdn.jsdelivr.net/gh/abander/img@main/vuepress-theme-vdoing/20220420181438.png)

## 8. button组件的click事件
> 我们在使用组件时，直接给组件定义事件是不会被触发的。
> 我们需要在组件中定义一个点击事件，这个点击事件不进行其他操作，只触发父组件中的点击事件。
### 8.1. 第一步
> 子组件中定义点击事件，这个点击事件的作用是调用父组件中的点击事件，并且回调
```vue
<template>
  <button class="hhh-button" :class="[`hhh-button-${type}`,{
    'is-plain': plain,
    'is-round': round,
    'is-circle': circle,
  }]"
   @click="handleClick"
  >
    <i v-if="icon" :class="`hhh-icon-${icon}`"></i>
    <span v-if="$slots.default"><slot></slot></span>
  </button>
</template>

<script>
export default {
  name: "hhhButton",
  methods: {
    handleClick (e) {
      this.$emit('click', e)
    }
  }
}
</script>
```
### 8.2. 第二步
> 父组件在使用时定义自己的点击事件，其本质是子组件中的点击事件触发父组件中的点击事件
```vue
<div class="row">
      <h4>点击事件</h4>
      <hhh-button icon="caomei" @click="getInfo">点击事件</hhh-button>
    </div>

<script>
export default {
  name: "btn",
  methods: {
    getInfo() {
      console.log('获取信息！！')//获取信息！！
    }
  }
}
</script>

```

## 9. button组件的disabled属性
> 和之前的plain属性、round属性、circle属性相似，
> 只要父子组件传值并且动态获取这个值并且赋给disabled属性,并且设置一个disabled样式即可。
### 9.1. 第一步
> 父组件传递disabled属性
```vue
 <div class="row">
      <h4>disabled</h4>
      <hhh-button disabled>按钮</hhh-button>
      <hhh-button disabled type="primary">primary按钮</hhh-button>
      <hhh-button disabled type="success">success按钮</hhh-button>
      <hhh-button disabled type="info">info按钮</hhh-button>
      <hhh-button disabled type="danger">danger按钮</hhh-button>
      <hhh-button disabled type="warning">warning按钮</hhh-button>
    </div>
```
### 9.2. 第二步
> 子组件接收父组件传递的数据
```vue
<script>
   export default {
    name: "hhhButton",
    props:{
      //disabled 的参数类型是Boolean，默认值是false
      disabled:{
            type: Boolean,
            default: false
        }
    },
}
</script>
```
### 9.3. 第三步
> 子组件要做两件事，一是disabled禁用了不能点，二是要通过绑定类名的方法动态控制样式。
```vue
<template>
  <button class="hhh-button" :class="[`hhh-button-${type}`,{
    'is-plain': plain,
    'is-round': round,
    'is-circle': circle,
    'is-disabled':disabled
  }]"
      @click="handleClick"
      :disabled="disabled"
  >
    <i v-if="icon" :class="`hhh-icon-${icon}`"></i>
    <span v-if="$slots.default"><slot></slot></span>
  </button>
</template>
```
### 9.4. 第四步
> 子组件设置不同类型样式
```css
/*disabled样式*/
.hhh-button.is-disabled {
cursor: no-drop;
}
```
## 10. 组件整体代码
### 10.1. button.vue子组件代码
```vue
<template>
  <button class="hhh-button" :class="[`hhh-button-${type}`,{
    'is-plain': plain,
    'is-round': round,
    'is-circle': circle,
    'is-disabled':disabled
  }]"
   @click="handleClick"
   :disabled="disabled"
  >
<!-- v-if="icon"： 在没有传入icon时隐藏<i>标签，只显示文字span标签 -->
    <i v-if="icon" :class="`hhh-icon-${icon}`"></i>
    <!-- span的左右就是可以控制slot的样式  -->
<!--v-if="$slots.default"的作用：用来判断是否传了插槽，如果没传入文本插槽，则不显示span内容  -->
<!-- 为什么是$slots.default。因为我们在任何一个组件中打印this.$slots，可以打印所有的插槽，只要传了插槽都会走一个默认default的插槽，没传则是空 -->
    <span v-if="$slots.default">
<!--凡是希望组件中内容可以灵活设置的地方，都需要用到slot插槽来自定义内容。-->
      <slot></slot>
    </span>
  </button>
</template>

<script>
export default {
  name: "hhhButton",
  //封装一个通用的组件，会对props做一个约束，props进行校验
  props:{
    type:{
      type: String,
      default:'default'
    },
    plain:{
      type: Boolean,
      default: false
    },
    round:{
      type: Boolean,
      default: false
    },
    circle:{
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: ''
    },
    disabled:{
      type: Boolean,
      default: false
    },
  },
  created () {
    console.log(this.type,'type') //defalut primary success info danger warning
  },
  methods: {
    handleClick (e) {
      this.$emit('click', e)
    }
  }

}
</script>

<style lang="scss" scoped>
/*button组件基础样式：*/
.hhh-button{
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #ffffff;
  border: 1px solid #dcdfe6;
  color: #606266;
  -webkit-appearance: none;
  text-align: center;
  box-sizing: border-box;
  outline: none;
  margin: 0;
  transition: 0.1s;
  font-weight: 500;
  //禁止元素的文字被选中
  -moz-user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;
  &:hover,
  &:hover{
    color: #409eff;
    border-color: #c6e2ff;
    background-color: #ecf5ff;
  }
}

/*根据type设置不同类型的样式*/
.hhh-button-primary{
  color:#fff;
  background-color: #409eff;
  border-color: #409eff;
  &:hover,
  &:focus{
    background: #66b1ff;
    background-color: #66b1ff;
    color: #fff;
  }
}
.hhh-button-success{
  color:#fff;
  background-color: #67c23a;
  border-color: #67c23a;
  &:hover,
  &:focus{
    background: #85ce61;
    background-color: #85ce61;
    color: #fff;
  }
}
.hhh-button-info{
  color:#fff;
  background-color: #909399;
  border-color: #909399;
  &:hover,
  &:focus{
    background: #a6a9ad;
    background-color: #a6a9ad;
    color: #fff;
  }
}
.hhh-button-warning{
  color:#fff;
  background-color: #e6a23c;
  border-color: #e6a23c;
  &:hover,
  &:focus{
    background: #ebb563;
    background-color: #ebb563;
    color: #fff;
  }
}
.hhh-button-danger{
  color:#fff;
  background-color: #f56c6c;
  border-color: #f56c6c;
  &:hover,
  &:focus{
    background: #f78989;
    background-color: #f78989;
    color: #fff;
  }
}

/*朴素按钮样式*/
.hhh-button.is-plain{
  &:hover,
  &:focus{
    background: #fff;
    border-color: #489eff;
    color: #409eff;
  }
}
.hhh-button-primary.is-plain{
  color: #409eff;
  background: #ecf5ff;
  &:hover,
  &:focus{
    background: #409eff;
    border-color: #409eff;
    color: #fff;
  }
}
.hhh-button-success.is-plain{
  color: #67c23a;
  background: #c2e7b0;
  &:hover,
  &:focus{
    background: #67c23a;
    border-color: #67c23a;
    color: #fff;
  }
}
.hhh-button-info.is-plain{
  color: #909399;
  background: #d3d4d6;
  &:hover,
  &:focus{
    background: #909399;
    border-color: #909399;
    color: #fff;
  }
}
.hhh-button-warning.is-plain{
  color: #e6a23c;
  background: #f5dab1;
  &:hover,
  &:focus{
    background: #e6a23c;
    border-color: #e6a23c;
    color: #fff;
  }
}
.hhh-button-danger.is-plain{
  color: #f56c6c;
  background: #fbc4c4;
  &:hover,
  &:focus{
    background: #f56c6c;
    border-color: #f56c6c;
    color: #fff;
  }
}

/*圆角按钮样式*/
.hhh-button.is-round{
  border-radius: 20px;
  padding: 12px 23px;
}

/*是否为圆形按钮样式*/
.hhh-button.is-circle{
  border-radius: 50%;
  padding: 12px;
}

/*icon样式*/
.hhh-button [class*=hhh-icon-]+span{
  margin-left: 5px;
}
/*disabled样式*/
.hhh-button.is-disabled {
  cursor: no-drop;
}
</style>


```
### 10.2. btn.vue父组件代码
```vue
<template>
  <div>
    <div class="row">
      <h4>基础按钮</h4>
      <hhh-button>按钮</hhh-button>
      <hhh-button type="primary">primary按钮</hhh-button>
      <hhh-button type="success">success按钮</hhh-button>
      <hhh-button type="info">info按钮</hhh-button>
      <hhh-button type="danger">danger按钮</hhh-button>
      <hhh-button type="warning">warning按钮</hhh-button>
    </div>

    <div class="row">
      <h4>朴素按钮</h4>
      <hhh-button plain>按钮</hhh-button>
      <hhh-button plain type="primary">primary按钮</hhh-button>
      <hhh-button plain type="success">success按钮</hhh-button>
      <hhh-button plain type="info">info按钮</hhh-button>
      <hhh-button plain type="danger">danger按钮</hhh-button>
      <hhh-button plain type="warning">warning按钮</hhh-button>
    </div>

    <div class="row">
      <h4>圆角按钮</h4>
      <hhh-button round>按钮</hhh-button>
      <hhh-button round type="primary">primary按钮</hhh-button>
      <hhh-button round type="success">success按钮</hhh-button>
      <hhh-button round type="info">info按钮</hhh-button>
      <hhh-button round type="danger">danger按钮</hhh-button>
      <hhh-button round type="warning">warning按钮</hhh-button>
    </div>

    <div class="row">
      <h4>是否为圆形按钮</h4>
      <hhh-button circle>按钮</hhh-button>
      <hhh-button circle type="primary">primary按钮</hhh-button>
      <hhh-button circle type="success">success按钮</hhh-button>
      <hhh-button circle type="info">info按钮</hhh-button>
      <hhh-button circle type="danger">danger按钮</hhh-button>
      <hhh-button circle type="warning">warning按钮</hhh-button>
    </div>

    <div class="row">
      <h4>icon</h4>
      <hhh-button icon="caomei"></hhh-button>
      <hhh-button icon="a-li_huaban1" type="primary"></hhh-button>
      <hhh-button icon="baixiangguo" type="success">success按钮</hhh-button>
      <hhh-button icon="huolongguo" type="info">info按钮</hhh-button>
      <hhh-button icon="yangtao" type="danger">danger按钮</hhh-button>
      <hhh-button icon="shanzhu" type="warning">warning按钮</hhh-button>
    </div>

    <div class="row">
      <h4>点击事件</h4>
      <hhh-button icon="caomei" @click="getInfo">点击事件</hhh-button>
    </div>

    <div class="row">
      <h4>disabled</h4>
      <hhh-button disabled>按钮</hhh-button>
      <hhh-button disabled type="primary">primary按钮</hhh-button>
      <hhh-button disabled type="success">success按钮</hhh-button>
      <hhh-button disabled type="info">info按钮</hhh-button>
      <hhh-button disabled type="danger">danger按钮</hhh-button>
      <hhh-button disabled type="warning">warning按钮</hhh-button>
    </div>
  </div>
</template>

<script>
import hhhButton from '../components/button.vue'
export default {
  name: "btn",
  components:{ hhhButton },
  methods: {
    getInfo() {
      console.log('获取信息！！')//获取信息！！
    }
  }
  }
</script>

<style scoped>

</style>

```
### 10.3. 效果
![](https://cdn.jsdelivr.net/gh/abander/img@main/vuepress-theme-vdoing/20220421150935.png)
## 11. button封装知识点加强
### 11.1. solt
- 凡是希望组件中内容可以灵活设置的地方，都需要用到slot插槽来自定义内容
- v-if="$slots.default"：我们在任何一个组件中打印this.$slots，可以打印所有的插槽，
  只要传了插槽都会走一个默认default的插槽，没传则是空
```vue
<template>
  <button class="hhh-button" :class="[`hhh-button-${type}`,{
    'is-plain': plain,
    'is-round': round,
    'is-circle': circle,
    'is-disabled':disabled
  }]"
      @click="handleClick"
      :disabled="disabled"
  >
    <!-- v-if="icon"： 在没有传入icon时隐藏<i>标签，只显示文字span标签 -->
    <i v-if="icon" :class="`hhh-icon-${icon}`"></i>
    <!-- span的左右就是可以控制slot的样式  -->
    <!--v-if="$slots.default"的作用：用来判断是否传了插槽，如果没传入文本插槽，则不显示span内容  -->
    <!-- 为什么是$slots.default。因为我们在任何一个组件中打印this.$slots，可以打印所有的插槽，只要传了插槽都会走一个默认default的插槽，没传则是空 -->
    <span v-if="$slots.default">
<!--凡是希望组件中内容可以灵活设置的地方，都需要用到slot插槽来自定义内容。-->
      <slot></slot>
    </span>
  </button>
</template>

```
### 11.2. vue 动态添加class类名
- 对象形式
- 三元表达式
- 数组形式、数组对象形式
- 方法形式
```vue
<template>
  <div>
    <h2>动态添加类名</h2>
    <!-- 第一种方式:对象的形式 -->
    <!-- 第一个参数 类名， 第二个参数：boolean值 -->
    <!-- 对象的形式: 用花括号包裹起来，类名用引号， -->
    <!-- 优点: 以对象的形式可以写多个，用逗号分开 -->
    <p :class="{'p1' : true}">对象的形式(文字的颜色)</p>
    <p :class="{'p1' : false, 'p': true}">对象的形式(文字的颜色)</p>
    
    <!-- 第二种方式:三元表达式 注意点：放在数组中，类名要用引号-->
    <p :class="[ 1 < 2 ? 'p1' : 'p' ]" >三元表示式(文字的颜色)</p>
    
    <!-- 第三种方式: 数组的形式 -->
    <p :class="[isTrue, isFalse]">数组的形式(文字的颜色)</p>

    <!-- 数组中用对象 -->
    <p :class="[{'p1': false}, isFalse]">数组中使用对象(文字的颜色)</p>
    
    <!--补充: class中还可以传方法，在方法中返回类名-->
    <p :class="setClass">通过方法设置class类名</p>
  </div>
</template>
<script>
export default {
 data () {
    return {
      isTrue: 'p1',
      isFalse: 'p'
    }
  },
 method: {
   setclass () {
     return 'p1';
   }
 }
}
</script>
<style scoped>
.p1 {
  color: red;
  font-size: 30px;
}
.p {
  color: blue
}
</style>
```



