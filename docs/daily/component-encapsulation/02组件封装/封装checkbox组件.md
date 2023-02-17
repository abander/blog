---
title: 封装checkbox组件
date: 2023-02-08 17:08:09
sidebar: auto
author: Smq
tags:
  - 封装
categories:
  - 总结
description: 封装checkbox组件
---

# 封装checkbox组件

::: tip 前言
封装checkbox组件
:::

## 1. checkbox组件的基本框架和样式
> checkbox同radio类似。显示checkbox效果
### 1.1. 基础组件(子组件)代码
```vue
<template>
  <label class="hhh-checkbox">
    <span class="hhh-checkbox_input">
      <span class="hhh-checkbox_inner"></span>
      <input type="checkbox"
             class="hhh-checkbox_original">
    </span>
    <span class="hhh-checkbox_label"></span>
  </label>
</template>


<script>
export default {
  name: "hhhCheckbox",
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
### 1.2. 基础组件(父组件)代码
```vue
<template>
  <hhh-checkbox></hhh-checkbox>
</template>

<script>
import hhhCheckbox from "../components/checkbox";
export default {
  name: "checkboxView",
  components:{hhhCheckbox},
}
</script>

<style scoped></style>
```

## 2. checkbox组件的label、name属性
### 2.1. 第一步
> 父组件传参
```vue
 <div>
    <hhh-checkbox name="00">单选</hhh-checkbox>
    <hhh-checkbox name="11" label="dan选"></hhh-checkbox>
  </div>
  ```
### 2.2. 第二步
> 子组件接收并通过是否有label属性判断
```vue
 <input type="checkbox"
        class="hhh-checkbox_original"
        :name="name"
>
<span class="hhh-checkbox_label">
      <slot></slot>
      <template v-if="!$slots.default">{{label}}</template>
</span>

 props: {
    name:{
        type:String,
        default:''
    },
    label: {
      type: [String, Number, Boolean],
      default: ''
    }
}
```

## 3. 单组件的v-model属性
### 3.1. 第一步
> 父组件传参
```vue
 <div>
    <hhh-checkbox name="00" v-model="active">单选</hhh-checkbox>
    <hhh-checkbox name="11" v-model="active" label="dan选"></hhh-checkbox>
  </div>
```
### 3.2. 第二步
> 子组件接收，并设置v-model，v-model其实需要绑定value值，但是我们不能直接修改父组件传过来的值，所以双向绑定自己的数据，
这个数据需要是外界传进来的，而且还是要能修改的，所以用到了计算属性。设置选中时的样式。
```vue
<label class="hhh-checkbox" :class="{'is-checked':model}"></label>
 <input type="checkbox"
             class="hhh-checkbox_original"
             :name="name"
             v-model="model"
      >
value: {
    type: Boolean,
    default: false
},

computed: {
    model: {
        get() {
         return this.value
        },
        set(value) {
          //触发父组件给当前组件注册的input事件
          this.$emit('input', value)
        }
  },
}
```


## 4. 组件整体代码
### 4.1. checkbox.vue子组件代码
```vue
<template>
  <label class="hhh-checkbox" :class="{'is-checked':model}">
    <span class="hhh-checkbox_input">
      <span class="hhh-checkbox_inner"></span>
      <input type="checkbox"
             class="hhh-checkbox_original"
             :name="name"
             v-model="model"
      >
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
  computed: {
    model: {
      get() {
        return this.value
      },
      set(value) {
        //触发父组件给当前组件注册的input事件
        this.$emit('input', value)
      }
    },
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
### 4.2. checkboxView.vue父组件代码
```vue
<template>
  <div>
    <hhh-checkbox name="00" v-model="active">单选</hhh-checkbox>
    <hhh-checkbox name="11" v-model="active" label="dan选"></hhh-checkbox>
  </div>
</template>
<script>
import hhhCheckbox from "../components/checkbox";
export default {
  name: "checkboxView",
  components:{hhhCheckbox},
  data(){
    return {
      active:''
    }
  }
}
</script>
<style scoped></style>
```





































