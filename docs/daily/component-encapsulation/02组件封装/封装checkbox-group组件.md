---
title: 封装checkbox-group组件
date: 2023-02-08 17:08:09
sidebar: auto
author: Smq
tags:
  - 封装
categories:
  - 总结
description: 封装checkbox-group组件
---
# 封装checkbox-group组件

::: tip 前言
封装checkbox-group组件
:::

## 1. checkbox-group组件的基本框架和样式
> checkbox-group与radio-group类似。
### 1.1. 基础组件(子组件)代码
```vue
<template>
  <div class="hhh-checkbox-group">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "hhhCheckboxGroup",
  props:{
    value: {
      type: Array,
      default: []
    }
  },
}
</script>
<style scoped></style>
```
### 1.2. 基础组件(父组件)代码
```vue
<template>
  <hhh-checkbox-group v-model="active">
    <hhh-checkbox name="11" label="复选1"></hhh-checkbox>
    <hhh-checkbox name="22" label="复选2"></hhh-checkbox>
    <hhh-checkbox name="33" label="复选3"></hhh-checkbox>
  </hhh-checkbox-group>
</template>

<script>
import hhhCheckboxGroup from "../components/checkbox-group";
import hhhCheckbox from "../components/checkbox";

export default {
  name: "checkboxGroupView",
  components:{hhhCheckboxGroup,hhhCheckbox},
  data(){
    return {
      active:['复选1','复选2','复选3'],
    }
  }
}
</script>
<style scoped></style>
```

## 2. checkbox-group组件的v-model属性
### 2.1. 第一步
> checkbox-group组件给checkbox组件传值
```vue
 provide(){
    return{
      checkboxGroup:this
    }
  }
```
### 2.2. 第二步
> checkbox组件接收，并设置默认值，
作用是：如果不是checkboxGroup包裹的，checkboxGroup就是空，如果是包裹的，就是传进来的东西
```vue
inject:{
    checkboxGroup:{
      default:''
    }
  },
```
> 添加计算属性isGroup判断checkbox是否被checkbox-group包裹,没包裹的是false，包裹的为true
```vue
 isGroup(){
      return !!this.checkboxGroup
    }
```
> 修改model计算属性，读取的不一定是this.value，还应该有this.checkboxGroup.value，设置同理
```vue
 model:{
      get(){
        //return this.value
        return this.isGroup ? this.checkboxGroup.value : this.value
      },
      set(value){
        //触发父组件给当前组件注册的input事件
        //this.$emit('input',value)
        this.isGroup ? this.checkboxGroup.$emit('input',value) : this.$emit('input',value)
      }
    },
```
> 多个checkbox的存在，需要加上value，因为选中的就是value，value也就是lable
```vue
 <input type="checkbox"
             class="hhh-checkbox_original"
             :name="name"
             v-model="model"
             :value="label"
      >
```
> 修改样式的判断：label与model计算属性的get方法返回的值进行比较
```vue
<label class="hhh-checkbox" :class="{'is-checked':isChecked}"></label>
isChecked () {
    // 如果是group包裹，判断label是否在model中
    // 如果没有group包裹,直接使用model
    return this.isGroup ? this.model.includes(this.label) : this.model
}
```

## 3. 组件整体代码
> 相对于checkboxGroupView组件来说，checkboxGroup是子组件，checkbox是孙组件
### 3.1. checkbox.vue孙组件代码
```vue
<template>
  <label class="hhh-checkbox" :class="{'is-checked':isChecked}">
    <span class="hhh-checkbox_input">
      <span class="hhh-checkbox_inner"></span>
      <input type="checkbox"
             class="hhh-checkbox_original"
             :name="name"
             v-model="model"
             :value="label"
      >
      <!--  多个checkbox的存在，需要加上value，因为选中的就是value，value也就是lable -->
    </span>
    <span class="hhh-checkbox_label">
      <slot></slot>
      <template v-if="!$slots.default">{{label}}</template>
    </span>
  </label>
</template>
<script>
export default {
  name: "hhhCheckbox",
  props: {
    name:{
      type:String,
      default:''
    },
    label: {
      type: [String, Number, Boolean],
      default: ''
    },
    value: {
      type: Boolean,
      default: false
    },
  },
  inject:{
    CheckboxGroup:{
      default:''
    }
  },
  computed: {
    model: {
      get() {
        //return this.value
        return this.CheckboxGroup ? this.CheckboxGroup.value : this.value //0
      },
      set(value) {
        //触发父组件给当前组件注册的input事件
        //this.$emit('input', value)
        this.CheckboxGroup ? this.CheckboxGroup.$emit('input',value) : this.$emit('input',value)
      }
    },
    isGroup(){
      return !!this.CheckboxGroup
    },
    isChecked () {
      // 如果是group包裹，判断label是否在model中
      // 如果没有group包裹,直接使用model
      return this.isGroup ? this.model.includes(this.label) : this.model
    }
  }
}
</script>
<style lang="scss" scoped>
//基础样式
.hhh-checkbox{
  color: #606266;
  font-weight: 500;
  font-size: 14px;
  position: relative;
  cursor: pointer;
  display: inline-block;
  white-space: nowrap;
  user-select: none;
  margin-right: 30px;
  .hhh-checkbox_input{
    white-space: nowrap;
    cursor: pointer;
    outline: none;
    display: inline-block;
    line-height: 1;
    position: relative;
    vertical-align: middle;
    .hhh-checkbox_inner{
      display: inline-block;
      position: relative;
      border: 1px solid #dcdfe6;
      border-radius: 2px;
      box-sizing: border-box;
      width: 14px;
      height: 14px;
      background-color: #fff;
      z-index: 1;
      transition: border-color .25s cubic-bezier(.71,-.46,.29,1.46),background-color .25s,cubic-bezier(.71,-.46,.29,1.46);
      &:after{
        box-sizing: content-box;
        content: '';
        border: 1px solid #ffffff;
        border-left: 0;
        border-top: 0;
        height: 7px;
        left: 4px;
        position: absolute;
        top: 1px;
        transform: rotate(45deg) scaleY(0);
        width: 3px;
        transition: transform .15s ease-in .05s;
        transform-origin: center;
      }
    }
    .hhh-checkbox_original{
      opacity: 0;
      outline: none;
      position: absolute;
      left: 10px;
      margin: 0;
      width: 0;
      height: 0;
      z-index: -1;
    }
  }
  .hhh-checkbox_label{
    display: inline-block;
    padding-left: 10px;
    line-height: 19px;
    font-size: 14px;
  }
}
// 选中的样式
.hhh-checkbox.is-checked{
  .hhh-checkbox_input{
    .hhh-checkbox_inner{
      background-color: #409eff;
      border-color: #409eff;
      &:after{
        transform: rotate(45deg) scaleY(1);
      }
    }
  }
  .hhh-checkbox_label{
    color: #409eff;
  }
}
</style>
```
### 3.2. checkboxGroup.vue子组件代码
```vue
<template>
  <div class="hhh-checkbox-group">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "hhhCheckboxGroup",
  provide(){
    return{
      CheckboxGroup:this
    }
  },
  props:{
    value: {
      type: Array,
      default: []
    }
  },
}
</script>
<style scoped></style>
```
### 3.3. checkboxGroupView.vue父组件代码
```vue
<template>
  <hhh-checkbox-group v-model="active">
    <hhh-checkbox name="11" label="复选1"></hhh-checkbox>
    <hhh-checkbox name="22" label="复选2"></hhh-checkbox>
    <hhh-checkbox name="33" label="复选3"></hhh-checkbox>
  </hhh-checkbox-group>
</template>

<script>
import hhhCheckboxGroup from "../components/checkbox-group";
import hhhCheckbox from "../components/checkbox";

export default {
  name: "checkboxGroupView",
  components:{hhhCheckboxGroup,hhhCheckbox},
  data(){
    return {
      active:['复选1','复选2','复选3'],
    }
  }
}
</script>
<style scoped></style>
```
