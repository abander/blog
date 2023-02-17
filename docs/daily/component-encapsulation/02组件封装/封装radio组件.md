---
title: 封装radio组件
date: 2023-02-08 17:08:09
sidebar: auto
author: Smq
tags:
  - 封装
categories:
  - 总结
description: 封装radio组件
---

# 封装radio组件

::: tip 前言
封装radio组件
:::

## 1. 参数支持
|   参数设置   | 参数描述 | 参数类型 |   参数类型   |
|:--------:| :------: | :------: |:--------:|
| v-model  | 双向绑定  | boolean |     false     |
|  label   | 静态框的value值 | string/num/boolean |   -    |
|   name   | name属性 | string |   -    |

## 2. radio组件的基本框架和样式
> 显示radio效果
### 2.1. 基础组件(子组件)代码
```vue
<template>
  <label class="hhh-radio">
    <span class="hhh-radio_input">
      <span class="hhh-radio_inner"></span>
      <input type="radio"
             class="hhh-radio_original">
    </span>
    <span class="hhh-radio_label">我是label</span>
  </label>
</template>
<script>
export default {
  name: "hhhRadio"
}
</script>
<style lang="scss" scoped>
//radio基础样式
.hhh-radio{
  color: #606266;
  font-weight: 500;
  line-height: 1;
  position: relative;
  cursor: pointer;
  display: inline-block;
  white-space: nowrap;
  outline: none;
  font-size: 14px;
  margin-right: 30px;
  -moz-user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  .hhh-radio_input{
    white-space: nowrap;
    cursor: pointer;
    outline: none;
    display: inline-block;
    line-height: 1;
    position: relative;
    vertical-align: middle;
    .hhh-radio_inner{
      border: 1px solid #dcdfe6;
      border-radius: 100%;
      width: 14px;
      height: 14px;
      background-color: #fff;
      position: relative;
      cursor: pointer;
      display: inline-block;
      box-sizing: border-box;
      &:after{
        width: 4px;
        height: 4px;
        border-radius: 100%;
        background-color: #fff;
        content: "";
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%) scale(0);
        transition: transform .15s ease-in;
      }
    }
    .hhh-radio_original{
      opacity: 0;
      outline: none;
      position: absolute;
      z-index: -1;
      top: 0;
      left: 0px;
      right: 0;
      bottom: 0;
      margin: 0;
    }
  }
  .hhh-radio_label{
    font-size: 14px;
    padding-left: 10px;;
  }
}
</style>

```
### 2.2. 基础组件(父组件)代码
```vue
<template>
  <hhh-radio></hhh-radio>
</template>
<script>
import hhhRadio from "../components/radio";
export default {
  name: "radioView",
  components:{hhhRadio},
}
</script>
<style scoped></style>
```

## 3. 选中radio时的样式
> 添加is-checkedclass类，并设置样式
```vue
 <label class="hhh-radio is-checked"></label>

<style lang="scss" scoped>
// 选中的样式
.hhh-radio.is-checked{
  .hhh-radio_input{
    .hhh-radio_inner{
      border-color: #409eff;
      background-color: #409eff;
      &:after{
        transform: translate(-50%,-50%) scale(1);
      }
    }
  }
  .hhh-radio_label{
    color:#409eff;
  }
}
</style>
```

## 4. 添加label、name属性
### 4.1. 第一步
> 父组件传参
```vue
<template>
  <div>
<!-- 后两个需要显示label内容   -->
    <hhh-radio label="1" name="11" v-model="gender">男</hhh-radio>
    <hhh-radio label="0" name="00" v-model="gender">女</hhh-radio>
    <hhh-radio label="1" name="11" v-model="gender"></hhh-radio>
    <hhh-radio label="0" name="00" v-model="gender"></hhh-radio>
  </div>
</template>
<script>
import hhhRadio from "../components/radio";
export default {
  name: "radioView",
  components:{hhhRadio},
  data(){
    return {
      gender:'1'
    }
  }
}
</script>
<style scoped></style>
```
### 4.2. 第二步
> 子组件接收并设置label和name值 。<br />
> 设置label时添加默认插槽，显示标签文字。当没有写标签文字时，显示label内容。
然后判断传了文字的打印this.$slot会显示default对象，没传的是显示空对象。<br />
> 设置name、value值，input的value也就是我们的label值
```vue
<input type="radio" class="hhh-radio_original"
       :value="label"
       :name="name"
>
<span class="hhh-radio_label">
      <slot></slot>
      <!--  如果没有传内容，就把label当成内容   -->
      <template v-if="!$slots.default">{{label}}</template>
</span>
props:{
    label:{
      type:[String,Number,Boolean],
      default:''
    },
    value:{
      type:String,
      default:''
    },
    name:{
      type:String,
      default:''
    }
  },
```

## 5.  添加v-model属性
> 添加v-model属性，并动态设置radio样式

难点v-model：<br />
当我们操作多个input或者多个radio，而且希望两个单选框是一组，控制的是一个值，就要用到v-model。<br />
设置v-model:<br />
v-model其实需要绑定value值，但是我们不能直接修改父组件传过来的值，所以双向绑定自己的数据，
这个数据需要是外界传进来的，而且还是要能修改的，所以用到了计算属性
```vue
<input type="radio" class="hhh-radio_original"
         :value="label"
         :name="name"
         v-model="model"
  >
<script>
export default {
  computed: {
    model: {
      get() {
        return this.value
      },
      set(value) {
        //触发父组件给当前组件注册的input事件
        this.$emit('input', value)
      }
    }
  },
}
</script>
```
设置样式：当label的值和value的值相等的时候才显示选中
```vue
 <label class="hhh-radio" :class="{'is-checked':label===value}"></label>
```

## 6. 组件整体代码
### 6.1. radio.vue子组件代码
```vue
<template>
<!-- 难点v-model：
 当我们操作多个input或者多个radio，而且希望两个单选框是一组，控制的是一个值，就要用到v-model
 -->
  <label class="hhh-radio" :class="{'is-checked':label===value}">
    <span class="hhh-radio_input">
      <span class="hhh-radio_inner"></span>
<!--  input的value也就是我们的label值    -->
<!--  v-model其实需要绑定value值，但是我们不能直接修改父组件传过来的值，所以双向绑定自己的数据，
      这个数据需要是外界传进来的，而且还是要能修改的，所以用到了计算属性
-->
      <input type="radio" class="hhh-radio_original"
             :value="label"
             :name="name"
             v-model="model"
      >
    </span>
    <span class="hhh-radio_label">
      <slot></slot>
<!--  如果没有传内容，就把label当成内容   -->
      <template v-if="!$slots.default">{{label}}</template>
    </span>
  </label>
</template>
<script>
export default {
  name: "hhhRadio",
  props:{
    label:{
      type:[String,Number,Boolean],
      default:''
    },
    value:{
      type:String,
      default:''
    },
    name:{
      type:String,
      default:''
    }
  },
  computed:{
    model:{
      get(){
        return this.value
      },
      set(value){
        //触发父组件给当前组件注册的input事件
        this.$emit('input',value)
      }
    }
  },
}
</script>
<style lang="scss" scoped>
//radio基础样式
.hhh-radio{
  color: #606266;
  font-weight: 500;
  line-height: 1;
  position: relative;
  cursor: pointer;
  display: inline-block;
  white-space: nowrap;
  outline: none;
  font-size: 14px;
  margin-right: 30px;
  -moz-user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  .hhh-radio_input{
    white-space: nowrap;
    cursor: pointer;
    outline: none;
    display: inline-block;
    line-height: 1;
    position: relative;
    vertical-align: middle;
    .hhh-radio_inner{
      border: 1px solid #dcdfe6;
      border-radius: 100%;
      width: 14px;
      height: 14px;
      background-color: #fff;
      position: relative;
      cursor: pointer;
      display: inline-block;
      box-sizing: border-box;
      &:after{
        width: 4px;
        height: 4px;
        border-radius: 100%;
        background-color: #fff;
        content: "";
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%) scale(0);
        transition: transform .15s ease-in;
      }
    }
    .hhh-radio_original{
      opacity: 0;
      outline: none;
      position: absolute;
      z-index: -1;
      top: 0;
      left: 0px;
      right: 0;
      bottom: 0;
      margin: 0;
    }
  }
  .hhh-radio_label{
    font-size: 14px;
    padding-left: 10px;;
  }
}
// 选中的样式
.hhh-radio.is-checked{
  .hhh-radio_input{
    .hhh-radio_inner{
      border-color: #409eff;
      background-color: #409eff;
      &:after{
        transform: translate(-50%,-50%) scale(1);
      }
    }
  }
  .hhh-radio_label{
    color:#409eff;
  }
}
</style>
```
### 6.2. radioView.vue父组件代码
```vue
<template>
  <div>
    <hhh-radio label="1" name="11" v-model="gender">男</hhh-radio>
    <hhh-radio label="0" name="00" v-model="gender">女</hhh-radio>

    <hhh-radio label="1" name="11" v-model="gender"></hhh-radio>
    <hhh-radio label="0" name="00" v-model="gender"></hhh-radio>
  </div>
</template>
<script>
import hhhRadio from "../components/radio";
export default {
  name: "radioView",
  components:{hhhRadio},
  data(){
    return {
      gender:'1'
    }
  }
}
</script>
<style scoped></style>

```
### 6.3. 效果
![](https://cdn.jsdelivr.net/gh/abander/img@main/vuepress-theme-vdoing/20220425183439.png)



