---
title: 封装input组件
date: 2023-02-08 17:08:09
sidebar: auto
author: Smq
tags:
  - 封装
categories:
  - 总结
description: 封装input组件
---

# 封装input组件

::: tip 前言
封装input组件
:::

## 1. 参数事件支持
![](https://cdn.jsdelivr.net/gh/abander/img@main/vuepress-theme-vdoing/20220422101750.png)

## 2. input组件的基本框架和样式以及处理placeholde、type、name、disabled
> 因为这部分与前面介绍的内容相同且比较简单，所以将这部分放在一起，不多做介绍了。
> <br />
这里需要注意的是，disabled属性为true时，输入框禁用，并且需要改变样式，
> 之前在button组件封装的时候也用到了相同的方法，获取到值后动态设置组件样式。

### 2.1. 子组件接收
> v-bind='$attrs'可以接收原生属性，省略props。
```vue
<template>
  <div class="hhh-input">
<!--  普通接收props+ :placeholder="placeholder" -->
<!--    <input :placeholder="placeholder"></input>-->
    
<!--  $attrs接收： v-bind="$attrs" -->
    <input class="hhh-input_inner" v-bind="$attrs" :class="{'is-disabled': disabled}" :disabled="disabled"></input>
  </div>
</template>
<script>
export default {
  name: "hhhInput",
  props:{
    /*placeholder:{
      type:String,
      default:''
    }*/
    disabled: {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style lang="scss" scoped>
.hhh-input{
  width: 100%;
  position: relative;
  font-size: 14px;
  display: inline-block;
  .hhh-input_inner{
    -webkit-appearance: none;
    background-color: #fff;
    background-image: none;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 40px;
    line-height: 40px;
    outline: none;
    padding: 0 15px;
    transition: border-color .2s cubic-bezier(.645,045,.355,1);
    width: 100%;

    &:focus{
      outline: none;
      border-color: #409eff;
    }
    // input禁用样式
    &.is-disabled{
      background-color: #f5f7fa;
      border-color: #e4e7ed;
      color: #c0c4cc;
      cursor:not-allowed;
    }
  }
}
</style>
```
### 2.2. 父组件传值
```vue
<template>
  <div>
    <h3>placeholder、type为password</h3>
    <hhh-input placeholder="请输入" type="password"></hhh-input>
    <h3>disabled</h3>
    <hhh-input placeholder="请输入" type="password" disabled></hhh-input>
    <h3>name属性</h3>
    <hhh-input placeholder="请输入" name="name属性"></hhh-input>
  </div>
</template>
<script>
import hhhInput from "../components/input";
export default {
  name: "inputView",
  components:{hhhInput},
}
</script>
```

## 3. input组件的v-model语法糖
> 实现v-model的原理：
> <br />
> 父组件的子组件上添加:value、@input相当于给子组件添加了属性名叫value的props和一个名为input的自定义事件
### 3.1. 第一步
父组件中添加v-model属性
```vue
<hhh-input placeholder="请输入" v-model="username"></hhh-input>
```
原生实现v-model
```vue
 <hhh-input placeholder="请输入" :value="username" @input="handleinput"></hhh-input>

handleinput(e){
  this.username=e
}
```

### 3.2. 第二步
子组件添加value属性和input事件，然后在事件里面不能直接修改props，通过自定义事件通知父组件修改
```vue
<input class="hhh-input_inner"
       v-bind="$attrs"
       :class="{'is-disabled': disabled}"
       :disabled="disabled"
       :value="value"
       @input="handleInput"
></input>

value: {
    type: String,
    default: ''
},

handleInput(e){
  this.$emit('input', e.target.value)
  }
```

## 4. input组件的clearable、showPassword功能
> 当我们在组件中键入clearable属性时，我们希望组件可以有一个一键删除数据得功能。
<br />
当input组件的type属性是password时，我们希望在给与show-password属性时，可以有一个显示和隐藏密码的按钮。
<br />
实现这个两个功能，除了基本的父子组件传值外，还要添加i标签的icon字体图标，以及实现功能
### 4.1. 第一步
> 实现小图标的显示
>
父组件传递属性，下载iconfont
```vue
 <hhh-input placeholder="请输入" v-model="username" clearable></hhh-input>
<hhh-input placeholder="请输入" v-model="username" type="password" show-password></hhh-input>```
```
子组件接收

- props接收，并创建span和i标签放iconfont图标
- div标签判断：只有clearable、showPassword这两个传了一个就显示小图标
- span标签判断：clearable、showPassword传了才显示span标签
- i标签判断：只有当clearable、showPassword存在才显示i标签
```vue
<template>
  <div class="hhh-input" :class="{'hhh-input_suffix':showSuffix}">
    <input class="hhh-input_inner"
           v-bind="$attrs"
           :class="{'is-disabled': disabled}"
           :disabled="disabled"
           :value="value"
           @input="handleInput"
    ></input>
<!-- 实现clearable功能和showPassword功能   -->
    <span class="hhh-input_suffix" v-if="showSuffix">
       <i class="hhh-icon-cancel" v-if="clearable"></i>
       <i class="hhh-icon-visible" v-if="showPassword"></i>
 </span>
  </div>
</template>

 clearable : {
      type: Boolean,
      default: false
    },
showPassword : {
  type: Boolean,
  default: false
},
computed:{
    showSuffix(){
    //只有这两个传了一个就显示小图标
    return this.clearable || this.showPassword
  }
},
<style lang="scss" scoped>
/*input的clearable样式和showPassword样式*/
.hhh-input_suffix {
  .hhh-input_inner {
    padding-right: 30px;
  }
  .hhh-input_suffix {
    position: absolute;
    right: 10px;
    height: 100%;
    top: 0;
    line-height: 40px;
    text-align: center;
    color: #c0c4cc;
    transition: all .3s;
    z-index: 900;

    i {
      color: #c0c4cc;
      font-size: 14px;
      cursor: pointer;
      transition: color .2s cubic-bezier(.645, .045, .355, 1);
    }
  }
}
</style>
```

### 4.2. 第二步
#### 4.2.1. 实现clearable功能
> 这时候父组件传递了值子组件并接收了，然后给i标签绑定一个点击事件清空输入的值，
> 但不能直接修改，需要通知父组件修改，并且x号不用一直显示，只有有值的时候才显示。
```vue
<span class="hhh-input_suffix" v-if="showSuffix">
       <i class="hhh-icon-cancel" v-if="clearable && value" @click="clear"></i>
 </span>

clear(){
  this.$emit('input', '')
},
```
#### 4.2.2. 实现showPassword功能
> 实现showPassword功能的思路很简单，就是改变input的type类型即可。
<br />
但是，我们不能直接改变父组件传递过来的type值，但是我们可以使用判断type值的方式，实现type的改变。
#### 4.2.2.1. 第一步
> 定义一个click事件、passwordVisible属性，
> 作用是是否显示密码框，在click事件中给passwordVisible取反并赋值。
```vue
<i class="hhh-icon-visible" v-if="showPassword" @click="handlePassword"></i>

data(){
    return {
        // 显示是否显示密码框
        passwordVisible: false
    }
},

handlePassword(){
  this.passwordVisible = !this.passwordVisible
},
```
#### 4.2.2.2. 第二步
> 修改type的值：`:type="showPassword ? (passwordVisible ? 'type' : 'password') : type"`
<br />
先判断showPassword是否为真，
为真则通过passwordVisible去判断type为text还是password，以此来控制显隐，
> <br />
为假type值就为传入的type值即可
```vue
<input class="hhh-input_inner"
           v-bind="$attrs"
           :class="{'is-disabled': disabled}"
           :disabled="disabled"
           :type="showPassword ? (passwordVisible ? 'type' : 'password') : type"
           :value="value"
           @input="handleInput"
    ></input>
```

## 5. 关于clearable和showPassword和v-model连用
### 5.1. clearable
> clearable的作用就是把输入框清空，所以给了它点击事件，在里面通知父组件把input置为空。
> <br />
> 为什么是this.$emit('input', '') ？其实原生属性更好理解，不用v-model，是给父元素一个value属性和@input事件，
> 这里的input事件也就是子组件触发的input。
### 5.2. showPassword
> 如果去掉v-model，效果是输入值，点击icon会清空input的值。
> 因为v-model给子组件了一个valu的props值和input事件，当我们输入值，没有加v-model时，
> 只是input框里面有值，子组件的value并没有值，没有进行双向绑定，所以当点击icon的时候再次执行代码，value里面
> 是空的，也就是置为了空，可以测试一下，在子组件的props的value属性的default给默认值123，
> 当我们输入input的值时，点击icon，这时候input显示的就是默认值123。

## 6. 组件整体代码
### 6.1. input.vue子组件代码
```vue
<template>
  <div class="hhh-input" :class="{'hhh-input_suffix':showSuffix}">
    <!--  普通接收props+ :placeholder="placeholder" -->
    <!--    <input :placeholder="placeholder"></input>-->

    <!--  $attrs接收： v-bind="$attrs" -->
    <input class="hhh-input_inner"
           v-bind="$attrs"
           :class="{'is-disabled': disabled}"
           :disabled="disabled"
           :type="showPassword ? (passwordVisible ? 'type' : 'password') : type"
           :value="value"
           @input="handleInput"
    ></input>
    <!--  先判断showPassword是否为真；
      如果为真则通过passwordVisible去判断type为text还是password，以此来控制隐藏和现实，
      为假type值就为传入的type值即可
    :type="showPassword ? (showPassword ? 'type' : 'password') : type"
   -->

    <!-- 实现clearable功能和showPassword功能   -->
    <span class="hhh-input_suffix" v-if="showSuffix">
       <i class="hhh-icon-cancel" v-if="clearable  && value" @click="clear"></i>
       <i class="hhh-icon-visible" v-if="showPassword" @click="handlePassword"></i>
 </span>

  </div>
</template>

<script>
export default {
  name: "hhhInput",
  props:{
    /* placeholder:{
       type:String,
       default:''
     },*/
    type:{
      type:String,
      default:''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ''
    },
    clearable : {
      type: Boolean,
      default: false
    },
    showPassword : {
      type: Boolean,
      default: false
    },
  },
  computed:{
    showSuffix(){
      //只有这两个传了一个就显示小图标
      return this.clearable || this.showPassword
    }
  },
  data(){
    return {
      // 显示是否显示密码框
      passwordVisible: false
    }
  },
  methods:{
    handleInput(e){
      this.$emit('input', e.target.value)
    },
    clear(){
      this.$emit('input', '')
    },
    /*不可以直接修改type，自己定义一个类型去修改*/
    handlePassword(){
      this.passwordVisible = !this.passwordVisible
    },
  }
}
</script>
<style lang="scss" scoped>
/*input基础样式和disable样式*/
.hhh-input{
  width: 100%;
  position: relative;
  font-size: 14px;
  display: inline-block;
  .hhh-input_inner{
    -webkit-appearance: none;
    background-color: #fff;
    background-image: none;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 40px;
    line-height: 40px;
    outline: none;
    padding: 0 15px;
    transition: border-color .2s cubic-bezier(.645,045,.355,1);
    width: 100%;

    &:focus{
      outline: none;
      border-color: #409eff;
    }
    // input禁用样式
    &.is-disabled{
      background-color: #f5f7fa;
      border-color: #e4e7ed;
      color: #c0c4cc;
      cursor:not-allowed;
    }
  }
}
/*input的clearable样式和showPassword样式*/
.hhh-input_suffix {
  .hhh-input_inner {
    padding-right: 30px;
  }
  .hhh-input_suffix {
    position: absolute;
    right: 10px;
    height: 100%;
    top: 0;
    line-height: 40px;
    text-align: center;
    color: #c0c4cc;
    transition: all .3s;
    z-index: 900;
    i {
      color: #c0c4cc;
      font-size: 14px;
      cursor: pointer;
      transition: color .2s cubic-bezier(.645, .045, .355, 1);
    }
  }
}
</style>

```
### 6.2. inputView.vue父组件代码
```vue
<template>
  <div>
    <h3>placeholder、type为password</h3>
    <hhh-input placeholder="请输入" type="password"></hhh-input>
    <h3>disabled</h3>
    <hhh-input placeholder="请输入" type="password" disabled></hhh-input>
    <h3>name属性</h3>
    <hhh-input placeholder="请输入" name="name属性"></hhh-input>
    <h3>v-model</h3>
    <hhh-input placeholder="请输入" v-model="username"></hhh-input>
    <h3>clearable </h3>
    <hhh-input placeholder="请输入" v-model="username" clearable></hhh-input>
    <h3>showPassword </h3>
    <hhh-input placeholder="请输入" v-model="username" type="password" show-password></hhh-input>
    <h3>原生实现v-model </h3>
    <hhh-input placeholder="请输入" :value="username" @input="handleinput"></hhh-input>
  </div>
</template>

<script>
import hhhInput from "../components/input";
export default {
  name: "inputView",
  components:{hhhInput},
  data(){
    return {
      username:'',
    }
  },
  methods:{
    handleinput(e){
      this.username=e
    }
  }
}
</script>
<style scoped></style>
```
### 6.3. 效果
![](https://cdn.jsdelivr.net/gh/abander/img@main/vuepress-theme-vdoing/20220422161213.png)
## 7. input封装知识点加强
### 7.1. $v-bind='$attrs'用法
> v-bind='$attrs'可以接收原生属性，省略props。
>
父组件
```vue
<template>
  <div>
    <hhh-input placeholder="请输入" type="password"></hhh-input>
  </div>
</template>
<script>
import inputButton from "../components/input";
export default {
  name: "inputView",
  components:{inputButton},
}
</script>
```
子组件
```vue
<template>
  <input v-bind="$attrs"></input>
</template>
<script>
export default {
  name: "inputButton",
/*  props:{
    placeholder:{
      type:String,
      default:''
    }
  }*/
}
</script>
<style scoped></style>
```
### 7.2. v-model原生、组件实现
#### 7.2.1. 标签/元素实现：：value 、@input
父组件改为:value和input，子组件不变
```vue
  <hhh-input placeholder="请输入" :value="username" @input="handleinput"></hhh-input>

handleinput(e){
  this.username=e
}
```

#### 7.2.2. 组件实现
> 父组件的子组件上添加:value、@input相当于给子组件添加了属性名叫value的props和一个名为input的自定义事件
父组件
```vue
<hhh-input placeholder="请输入" v-model="username"></hhh-input>
```
子组件
```vue
<input class="hhh-input_inner"
       v-bind="$attrs"
       :class="{'is-disabled': disabled}"
       :disabled="disabled"
       :value="value"
       @input="handleInput"
></input>
    value: {
      type: String,
      default: ''
    },
    handleInput(e){
    this.$emit('input', e.target.value)
    }
```

