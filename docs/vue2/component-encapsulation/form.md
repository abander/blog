---
title: 封装form和form-item组件
date: 2023-02-08 17:08:09
sidebar: auto
author: Smq
tags:
  - 封装
categories:
  - 总结
description: 封装form和form-item组件
---

# 封装form和form-item组件

::: tip 前言
封装form和form-item组件
:::

## 1. form组件和form-item的基本框架和样式
### 1.1. 基础组件(父组件)代码
```vue
<template>
  <hhh-form>
    <hhh-form-item>
      <hhh-input placeholder="请输入"></hhh-input>
    </hhh-form-item>
  </hhh-form>
</template>

<script>
import hhhForm from '../components/form'
import hhhFormItem from '../components/form-item'
import HhhInput from "../components/input";
export default {
  name: "formView",
  components:{HhhInput, hhhForm,hhhFormItem},
  data(){
    return {
      model: {},
    }
  }
}
</script>
<style scoped></style>
```
### 1.2. 基础组件(子组件)代码
```vue
<template>
  <div class="one-form-item">
    <label class="one-form-item_label"></label>
    <div class="one-form-item_content">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: "hhhFormItem",
}
</script>
<style lang="scss" scoped>
.one-form-item{
  margin-bottom: 25px;
  .one-form-item_label{
    text-align: right;
    vertical-align: middle;
    float: left;
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
    box-sizing: border-box;
  }
  .one-form-item_content{
    line-height: 40px;
    position: relative;
    font-size: 14px;
    overflow: hidden;
  }
}
</style>
```
### 1.3. 基础组件(孙组件)代码
```vue
<template>
  <div class="hhh-form">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "hhhForm",
}
</script>
<style scoped></style>
```

## 2.form组件的model属性、label-width属性和form-item的label以及
### 2.1. 第一步
> 父组件传值
```vue
<template>
  <hhh-form :model="model" label-width="100px">
    <hhh-form-item label="用户名">
      <hhh-input placeholder="请输入"></hhh-input>
    </hhh-form-item>
  </hhh-form>
</template>
data(){
  return {
    model: {},
  }
}
```
### 2.2. 第二步
> 子组件form-item接收label并渲染
```vue
 <label class="one-form-item_label">{{label}}</label>
props:{
  label: {
    type: String,
    default:''
  }
},
```
> 孙组件form组件接收model和labelWidth属性,并把labelWidth属性传到form-item里面
```vue
props:{
   //用来收集数据
   model: {
     type: Object,
     required:true
   },
   //设置label宽度
   labelWidth:{
     type:String,
     default:'80px'
   }
 },
  //传下去，任何一个子组件可以接收到
  provide(){
    return{
      form:this
    }
  },
```
> formitem组件接收labelWidth并渲染
```vue
 <label class="one-form-item_label" :style="labelStyle">{{label}}</label>

 inject:['form'],
  computed: {
    labelStyle () {
      return {
        width: this.form.labelWidth
      }
    }
  }
```

## 3. 组件整体代码
> 相对于formView组件来说，form是子组件，form-item是孙组件
### 3.1. formView.vue父组件代码
```vue
<template>
  <hhh-form :model="model" label-width="100px">
    <hhh-form-item label="用户名">
      <hhh-input placeholder="请输入"></hhh-input>
    </hhh-form-item>
  </hhh-form>
</template>

<script>
import hhhForm from '../components/form'
import hhhFormItem from '../components/form-item'
import HhhInput from "../components/input";
export default {
  name: "formView",
  components:{HhhInput, hhhForm,hhhFormItem},
  data(){
    return {
      model: {},
    }
  }
}
</script>

<style scoped>

</style>

```
### 3.2. form.vue子组件代码
```vue
<template>
  <div class="hhh-form">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "hhhForm",
 props:{
   //用来收集数据
   model: {
     type: Object,
     required:true
   },
   //设置label宽度
   labelWidth:{
     type:String,
     default:'80px'
   }
 },
  //传下去，任何一个子组件可以接收到
  provide(){
    return{
      form:this
    }
  },
}
</script>

<style scoped></style>
```
### 3.3. form-item.vue孙组件代码
```vue
<template>
  <div class="one-form-item">
    <label class="one-form-item_label" :style="labelStyle">{{label}}</label>
    <div class="one-form-item_content">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: "hhhFormItem",
  props:{
    label: {
      type: String,
      default:''
    }
  },
  inject:['form'],
  computed: {
    labelStyle () {
      return {
        width: this.form.labelWidth
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.one-form-item{
  margin-bottom: 25px;
  .one-form-item_label{
    text-align: right;
    vertical-align: middle;
    float: left;
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
    box-sizing: border-box;
  }
  .one-form-item_content{
    line-height: 40px;
    position: relative;
    font-size: 14px;
    overflow: hidden;
  }
}
</style>
```
