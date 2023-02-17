---
title: 封装radio-group组件
date: 2023-02-08 17:08:09
sidebar: auto
author: Smq
tags:
  - 封装
categories:
  - 总结
description: 封装radio-group组件
---

# 封装radio-group组件

::: tip 前言
封装radio-group组件
:::

## 1. radio-group组件的基本框架和样式
> 添加radio-group包裹和不包裹的两种组件，包裹的v-model绑定到父元素身上,
> v-model绑定到父元素身上，就获取不到radio组件里面的值了
> (比如radio组件的value值获取不到，因为没有给radio绑定v-model，而是给父组件绑定的)，
> 所以要通过radio组件去操作radio-group组件
### 1.1. 基础组件(子组件)代码
```vue
<template>
  <div class="radio-group">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "hhhRadioGroup",
  props:{
    value: {
      type: String,
      default: ''
    }
   },
}
</script>
<style scoped></style>
```
### 1.2. 基础组件(父组件)代码
```vue
<template>
  <div>
    <hhh-radio label="0" v-model="gender"></hhh-radio>
    <hhh-radio label="1" v-model="gender"></hhh-radio>

    <hhh-radio-group  v-model="gender">
      <hhh-radio label="0"></hhh-radio>
      <hhh-radio label="1"></hhh-radio>
    </hhh-radio-group>
  </div>
</template>

<script>
import hhhRadioGroup from "../components/radio-group";
import hhhRadio from "../components/radio";
export default {
  name: "radioGroupView",
  components:{hhhRadioGroup,hhhRadio},
  data(){
    return {
      gender:'1'
    }
  }
}
</script>
<style scoped></style>
```

## 2. radio-group组件的v-model属性
> 父组件给子组件传了v-model，子组件接收value值，并控制radio的value，
> 因为radio组件不一定是radio-group的子组件，有可能是孙组件，所以不适合用$parent，
> 这里用到了provide和inject
### 2.1. 第一步
> radio-group组件给radio组件传值
```vue
 provide(){
    return{
      RadioGroup:this
    }
  }
```
### 2.2. 第二步
> radio组件接收，并设置默认值，
作用是：如果不是radioGroup包裹的，RadioGroup就是空，如果是包裹的，就是传进来的东西
```vue
inject:{
    RadioGroup:{
      default:''
    }
  },
```
> 添加计算属性isGroup判断radio是否被radio-group包裹,没包裹的是false，包裹的为true
```vue
 isGroup(){
      return !!this.RadioGroup
    }
```
> 修改model计算属性，读取的不一定是this.value，还应该有this.RadioGroup.value，设置同理
```vue
 model:{
      get(){
        //return this.value
        return this.isGroup ? this.RadioGroup.value : this.value
      },
      set(value){
        //触发父组件给当前组件注册的input事件
        //this.$emit('input',value)
        this.isGroup ? this.RadioGroup.$emit('input',value) : this.$emit('input',value)
      }
    },
```
> 修改样式不显示的判断：label与model计算属性的get方法返回的值进行比较
```vue
 <label class="hhh-radio" :class="{'is-checked':label===model}"></label>
```

## 3. 组件整体代码
> 相对于radioGroupView组件来说，radioGroup是子组件，radio是孙组件
### 3.1. radio.vue孙组件代码
```vue
<template>
<!-- 难点v-model：
 当我们操作多个input或者多个radio，而且希望两个单选框是一组，控制的是一个值，就要用到v-model
 -->
<!--  <label class="hhh-radio" :class="{'is-checked':label===value}">-->
  <label class="hhh-radio" :class="{'is-checked':label===model}">
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
  //radio-group用到inject
  //给default的作用是：如果不是radioGroup包裹的，RadioGroup就是空，如果是包裹的，就是传进来的东西
  inject:{
    RadioGroup:{
      default:''
    }
  },
  props:{
    label:{
      type:[String,Number,Boolean],
      default:''
    },
    value:{ //gender 0
      type:String,
      default:''
    },
    name:{
      type:String,
      default:''
    }
  },
  computed:{
    //这里需要改动，不一定是返回的是this.value，还应该有this.RadioGroup.value，设置同理
    model:{
      get(){
        //return this.value
        return this.isGroup ? this.RadioGroup.value : this.value //0
      },
      set(value){
        //触发父组件给当前组件注册的input事件
        //this.$emit('input',value)
        this.isGroup ? this.RadioGroup.$emit('input',value) : this.$emit('input',value)
      }
    },
    isGroup(){
      //判断radio是否被radio-group包裹,没包裹的是false，包裹的为true
      return !!this.RadioGroup
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
### 3.2. radioGroup.vue子组件代码
```vue
<template>
  <div class="radio-group">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "hhhRadioGroup",
  //不适合用$parent，有可能radio-group和radio存在子孙关系，所以用provide和inject
  provide(){
    return{
      RadioGroup:this
    }
  },
  props:{
    value: {
      type: String,
      default: ''
    }
   },
}
</script>

<style scoped>

</style>

```
### 3.3. radioGroupView.vue父组件代码
```vue
<template>
  <div>
    <hhh-radio label="0" v-model="gender"></hhh-radio>
    <hhh-radio label="1" v-model="gender"></hhh-radio>

    <hhh-radio-group  v-model="gender">
      <hhh-radio label="0"></hhh-radio>
      <hhh-radio label="1"></hhh-radio>
    </hhh-radio-group>
  </div>
</template>

<script>
import hhhRadioGroup from "../components/radio-group";
import hhhRadio from "../components/radio";
export default {
  name: "radioGroupView",
  components:{hhhRadioGroup,hhhRadio},
  data(){
    return {
      gender:'1'
    }
  }
}
</script>

<style scoped>

</style>
```

## 4. radioGroup封装知识点加强
### 4.1. provide和inject
#### 4.1.1. 帮助我们解决多层次嵌套嵌套通信问题。
> 在provide中指定要传递给子孙组件的数据，子孙组件通过inject就可以注入祖父组件传递过来的数据，
不论组件层次有多深，始终生效

#### 4.1.2. 两者的概念：
> provide：是一个对象，或者是一个返回对象的函数。可以将想要传递给子孙组件的属性写入该对象中。
注意：若子孙组件中的provide和父组件中provide提供的key有所相同，那么子孙组件会覆盖原本父组件的value

> inject：一个字符串数组，或 一个对象，对象的 key 是本地的绑定名，value 是： 在可用的注入内容中搜索用的 key (字符串或 Symbol)，
> 或 一个对象，该对象的： from 属性是在可用的注入内容中搜索用的 key (字符串或 Symbol) default 属性是降级情况下使用的 value
#### 4.1.3. 使用场景
> 由于vue有$parent属性可以让子组件访问父组件。
> 但孙组件想要访问祖先组件就比较困难。通过provide/inject可以轻松实现跨级访问祖先组件的数据
#### 4.1.4. 注意点
> provide 和 inject 绑定并不是可响应的。这是刻意为之的。
> 然而，如果你传入了一个可监听的对象，那么其对象的属性还是可响应的。
#### 4.1.5. 案例
radioGroup.vue父组件
```vue
 provide(){
    return{
      RadioGroup:this
    }
},
```
radio.vue子组件/孙组件
```vue
  inject:{
    RadioGroup:{
      default:''
    }
  },
```
### 4.2. JS中 !!和 ！的用法
#### 4.2.1. !用法
> ！可将变量转换成boolean类型，0,null、undefined和空字符串取反都为true，其余都为false。
#### 4.2.2. !!用法
> !! 两个叹号表示把目标值转化为布尔值，相当于使用Boolean()方法
```vue
!!"123"  相当于是   Boolean("123")    //结果为true
!!{a:1}  相当于是   Boolean({a:1})    //结果为true
```



