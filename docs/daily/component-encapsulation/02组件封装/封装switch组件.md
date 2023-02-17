---
title: 封装switch组件
date: 2023-02-08 17:08:09
sidebar: auto
author: Smq
tags:
  - 封装
categories:
  - 总结
description: 封装switch组件
---

# 封装switch组件

::: tip 前言
封装switch组件
:::

## 1. 参数、事件支持
![](https://cdn.jsdelivr.net/gh/abander/img@main/vuepress-theme-vdoing/20220424153947.png)

## 2. switch组件的基本框架和样式
> 显示switch效果
### 2.1. 基础组件(子组件)代码
```vue
<template>
  <div class="hhh-switch">
    <span class="hhh-switch_core">
      <span class="hhh-switch_button"></span>
    </span>
  </div>
</template>

<script>
export default {
  name: "hhhSwitch",
}
</script>
<style lang="scss" scoped>
/*switch基础样式*/
.hhh-switch{
  display: inline-block;
  align-items: center;
  position: relative;
  font-size: 14px;
  line-height: 20px;
  vertical-align: middle;
  .hhh-switch_core{
    margin: 0;
    display: inline-block;
    position: relative;
    width: 40px;
    height: 20px;
    border: 1px solid #dcdfe6;
    outline: none;
    border-radius: 10px;
    box-sizing: border-box;
    background: #dcdfe6;
    cursor: pointer;
    transition: border-color .3s,background-color .3s;
    vertical-align: middle;
    .hhh-switch_button{
      position:absolute;
      top: 1px;
      left: 1px;
      border-radius: 100%;
      transition: all .3s;
      width: 16px;
      height: 16px;
      background-color: #fff;
    }
  }
}
</style>
```
### 2.2. 基础组件(父组件)代码
```vue
<template>
  <hhh-switch></hhh-switch>
</template>
<script>
import hhhSwitch from "../components/switch";
export default {
  name: "switchView",
  components:{hhhSwitch},
}
</script>
```

## 3. 实现switch组件的数据双向绑定
> 实现switch组件数据双向绑定和input组件相同，使用v-model语法糖即可。
<br />
在父组件种通过v-model绑定数据，在组件内部获取value属性，并且定义一个回调函数与父组件通信，改变父组件中的绑定值即可。
### 3.1. 第一步
> 父组件添加v-model属性
```vue
 <hhh-switch v-model="active"></hhh-switch>
data(){
    return {
      active: false
    }
}
```
### 3.2. 第二步
> 接收到一个value的props并添加click事件，在click事件中，通知父组件修改value值，进行点击时就是取反的过程
> 改变is-checked类状态，触发滑块滑动,然后在给switch加上样式即可
```vue
<template>
  <div class="hhh-switch" :class="{'is-checked':value}" @click="handleSwitch">
    <span class="hhh-switch_core">
      <span class="hhh-switch_button"></span>
    </span>
  </div>
</template>
<script>
export default {
  name: "hhhSwitch",
  props:{
    value:{
      type:Boolean,
      default:false
    }
  },
  methods:{
    handleSwitch(e){
      this.$emit('input', !this.value)
    }
  }
}
</script>
<style lang="scss" scoped>
/*选中样式*/
.is-checked {
  .hhh-switch_core{
    border-color: #409eff;
    background-color: #409eff;
    .hhh-switch_button {
      transform: translateX(20px);
    }
  }
}
</style>
```

## 4.实现switch组件颜色自定义
> 自定义switch组件的颜色，首先需要传入颜色的值，在子组件中获取后，使用ref获取节点，将背景颜色改变为对应颜色即可。
### 4.1. 第一步
> 父组件添加激活和不激活颜色属性
```vue
<hhh-switch v-model="active"  active-color="#13ce66" inactive-color="#ff4949"></hhh-switch>
```
### 4.2. 第二步
- 子组件接收父组件属性，定义props
- 给标签定义ref="core"以确定节点
- 颜色发生变化是要在刚进来的时候就能看到，用到了mounted钩子
- 创建修改开关颜色方法，通过ref找到节点并判断颜色，给边框和背景颜色设置自定义的颜色，并在mounted中调用
- 初始化颜色设置完成，当点击切换的时候也需要再次设置自定义颜色，所以在切换的地方再次调用方法，
  - 问题：
    <br />由于刚进去就是false，显示绿色，当点击切换的时候就是true了，true的时候颜色应该是橙色，但页面显示还是绿色。
    我们可以在子组件打印this.value和打开VUE开发者工具看下，默认为false，点击为true，VUE里面的value显示为true了，但是
    打印的依旧是false，这是因为触发了父组件的input事件进行改值，但是父组件的值还没有改完就调用修改开关颜色方法了，
    所以是有问题的。
    <br />
    解决：
    <br />我们需要等待value发生了变化在调用修改颜色方法，
    这时候我们可以使用$nextTick，数据修改之后，等待dom更新，在修改按钮的颜色。
    $nextTick的作用就是把请求延迟到下一次dom更新之后
```vue
<div class="hhh-switch" :class="{'is-checked':value}" @click="handleSwitch">
<!--  自定义颜色也就是需要控制span的颜色  -->
    <span class="hhh-switch_core" ref="core">
      <span class="hhh-switch_button"></span>
    </span>
</div>
<script>
export default {
  name: "hhhSwitch",
  props:{
    activeColor:{
      type:String,
      default:''
    },
    inactiveColor:{
      type:String,
      default:''
    }
  },
  methods:{
    handleSwitch(e){
      this.$emit('input', !this.value)
      this.$nextTick(()=>{
        this.setColor()
      })
    },
    setColor(){
      // 修改开关颜色
      if (this.activeColor || this.inactiveColor) {
        let color = !this.value ? this.activeColor : this.inactiveColor
        this.$refs.core.style.borderColor = color
        this.$refs.core.style.backgroundColor = color
      }
    }
  },
  mounted () {
    this.setColor()
  },
}
</script>
```
## 5. 实现switch组件的name属性支持
> 用户在使用switch组件的时候，实质上是当成表单元素来使用的。因此可能会用到组件的name属性。
> 所以需要在switch组件中添加一个checkbox，并且当值改变的时候，也需要设置checkbox的value值。
### 5.1. 第一步
> 父组件传输name属性
```vue
<hhh-switch v-model="active"  active-color="#13ce66" inactive-color="#ff4949" name="username"></hhh-switch>
```
### 5.2. 第二步
> 子组件接收name属性，添加input框，ref进行确定节点，在mounted、handleSwitch中和把value值赋值给checked，
> 并隐藏input输入框,样式放在基础样式里面和.hhh-switch_core位置相同。
```vue
<template>
  <div class="hhh-switch" :class="{'is-checked':value}" @click="handleSwitch">
    <!--  自定义颜色也就是需要控制span的颜色  -->
    <span class="hhh-switch_core" ref="core">
      <span class="hhh-switch_button"></span>
    </span>
    <input type="checkbox" class="hhh-switch_input" :name="name" ref="input">
  </div>
</template>

name:{
  type:String,
  default:''
}
mounted () {
    this.setColor()
    //控制checkbox的值,input值同步value值
    this.$refs.input.checked = this.value
},
handleSwitch(e){
    this.$emit('input', !this.value)
        this.$nextTick(()=>{
          this.setColor()
        })
    //控制checkbox的值,input值同步value值
    this.$refs.input.checked = this.value
    },
<style lang="scss" scoped>
/*隐藏input标签*/
.hhh-switch_input{
  position:absolute;
  width: 0;
  height: 0;
  opacity: 0;
  margin: 0;
}
</style>
```

## 6. 组件整体代码
### 6.1. switch.vue子组件代码
```vue
<template>
  <div class="hhh-switch" :class="{'is-checked':value}" @click="handleSwitch">
    <!--  自定义颜色也就是需要控制span的颜色  -->
    <span class="hhh-switch_core" ref="core">
      <span class="hhh-switch_button"></span>
    </span>
    <input type="checkbox" class="hhh-switch_input" :name="name" ref="input">
  </div>
</template>

<script>
export default {
  name: "hhhSwitch",
  props:{
    value:{
      type:Boolean,
      default:false
    },
    activeColor:{
      type:String,
      default:''
    },
    inactiveColor:{
      type:String,
      default:''
    },
    name:{
      type:String,
      default:''
    }
  },
  methods:{
    handleSwitch(e){
      this.$emit('input', !this.value)
      this.$nextTick(()=>{
        this.setColor()
      })
      //控制checkbox的值,input值同步value值
      this.$refs.input.checked = this.value
    },
    setColor(){
      // 修改开关颜色
      if (this.activeColor || this.inactiveColor) {
        let color = !this.value ? this.activeColor : this.inactiveColor
        this.$refs.core.style.borderColor = color
        this.$refs.core.style.backgroundColor = color
      }
    }
  },
  mounted () {
    this.setColor()
    //控制checkbox的值,input值同步value值
    this.$refs.input.checked = this.value
  },
}
</script>


<style lang="scss" scoped>
/*switch基础样式*/
.hhh-switch{
  display: inline-block;
  align-items: center;
  position: relative;
  font-size: 14px;
  line-height: 20px;
  vertical-align: middle;
  .hhh-switch_core{
    margin: 0;
    display: inline-block;
    position: relative;
    width: 40px;
    height: 20px;
    border: 1px solid #dcdfe6;
    outline: none;
    border-radius: 10px;
    box-sizing: border-box;
    background: #dcdfe6;
    cursor: pointer;
    transition: border-color .3s,background-color .3s;
    vertical-align: middle;
    .hhh-switch_button{
      position:absolute;
      top: 1px;
      left: 1px;
      border-radius: 100%;
      transition: all .3s;
      width: 16px;
      height: 16px;
      background-color: #fff;
    }
  }
  /*隐藏input标签*/
  .hhh-switch_input{
    position:absolute;
    width: 0;
    height: 0;
    opacity: 0;
    margin: 0;
  }
}
/*选中样式*/
.is-checked {
  .hhh-switch_core{
    border-color: #409eff;
    background-color: #409eff;
    .hhh-switch_button {
      transform: translateX(20px);
    }
  }
}
</style>

```
### 6.2. switchView.vue父组件代码
```vue
<template>
  <hhh-switch v-model="active"  active-color="#13ce66" inactive-color="#ff4949" name="username"></hhh-switch>
</template>

<script>
import hhhSwitch from "../components/switch";
export default {
  name: "switchView",
  components:{hhhSwitch},
  data(){
    return {
      active: false,
    }
  }
}
</script>
<style scoped></style>
```
### 6.3. 效果
![](https://cdn.jsdelivr.net/gh/abander/img@main/vuepress-theme-vdoing/20220424170523.png)

