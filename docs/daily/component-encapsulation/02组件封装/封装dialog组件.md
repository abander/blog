---
title: 封装dialog组件
date: 2023-02-08 17:08:09
sidebar: auto
author: Smq
tags:
  - 封装
categories:
  - 总结
description: 封装dialog组件
---

# 封装dialog组件

::: tip 前言
封装dialog组件
:::

## 1. 需要用到的知识
- vue过渡动画
- sync修饰符
- 具名插槽与v-slot指令

## 2. 参数、事件、插槽支持
![](https://cdn.jsdelivr.net/gh/abander/img@main/vuepress-theme-vdoing/20220421150154.png)

## 3. dialog组件的基本框架和样式
### 3.1. 基础组件(子组件)代码
> 首先搭建起来dialog组件的框架，暂时不加入插槽，只构建出基本的框架和样式。
> 注意dialog的关闭的叉号要提前在iconfont下载下来，并在main.js中注册，然后在iconfont.css中修改为hhh-icon-close。
<br />
框架分为三个部分：头部（header）、内容（body）、底部（footer），基本框架如下：
```vue
<template>
  <div class="hhh-dialog_wrapper">
    <div class="hhh-dialog">
      <div class="hhh-dialog_header">
        <span class="one-dialog_title">提示</span>
        <button class="hhh-dialog_headerbtn">
          <i class="hhh-icon-close"></i>
        </button>
      </div>
      <div class="hhh-dialog_body">
        <span>这是一段信息</span>
      </div>
      <div class="hhh-dialog_footer">
        <hhh-button>取消</hhh-button>
        <hhh-button type="primary">确定</hhh-button>
      </div>
    </div>
  </div>
</template>
<script>
import hhhButton from './button.vue'
export default {
  name: "hhhDialog",
  components:{ hhhButton },
  props: {
    title: {
      type: String,
      default: ''
    },
  }
}
</script>
<style lang="scss" scoped>
/*dialog的基本样式*/
.hhh-dialog_wrapper{
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  margin: 0;
  z-index: 2001;
  background-color: rgba(0,0,0,0.5);
  .hhh-dialog{
    position: relative;
    margin: 15vh auto 50px;
    background: #fff;
    border-radius: 2px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
    box-sizing: border-box;
    width: 30%;
    &_header{
      padding: 20px 20px 10px;
      .hhh-dialog_title{
        line-height: 24px;
        font-size: 18px;
        color: #303133;
      }
      .hhh-dialog_headerbtn{
        position: absolute;
        top: 20px;
        right: 20px;
        padding: 0;
        background: transparent;
        border: none;
        outline: none;
        cursor: pointer;
        font-size: 16px;
        .hhh-icon-close{
          color: #909399
        }
      }
    }
    &_body{
      padding: 30px 20px;
      color: #606266;
      font-size: 14px;
      word-break: break-all;
    }
    &_footer{
      padding: 10px 20px 20px;
      text-align: right;
      box-sizing: border-box;
      ::v-deep .hhh-button:first-child{
        margin-right: 20px;
      }
    }
  }
}
</style>
```
### 3.2. 业务组件(父组件)代码
```vue
<template>
  <hhh-dialog></hhh-dialog>
</template>
<script>
import hhhDialog from '../components/dialog.vue'
export default {
  name: "dialogView",
  components:{ hhhDialog },
}
</script>
```
### 3.3. 效果
![](https://cdn.jsdelivr.net/gh/abander/img@main/vuepress-theme-vdoing/20220421151709.png)

## 4. dialog组件的title属性
> title标题部分除了普通的标题内容外，也应该可以设置标题的样式。
> 比如设置为h1红色的自定义标题内容，所以在这里我们就使用到了插槽，可以在使用时按照需求自定义标题内容和样式。
### 4.1. 第一步
> 将标题span标签放到slot插槽下，这样便于控制span的内容和样式
```vue
<template>
  <div class="hhh-dialog_wrapper">
    <div class="hhh-dialog">
      <div class="hhh-dialog_header">
        
        <slot name="title">
  <!--
     将span放到slot内，这样不仅可以定义title文本，还可以定义样式等
     利用具名插槽，如果父组件传了slot，则显示父组件插槽的title文本（子组件slot以及span标签会整体被父组件slot替换），
     不传slot，则显示传过来的title属性(span正常渲染)
   -->
          <span class="hhh-dialog_title">{{title}}</span>
        </slot>
        
        <button class="hhh-dialog_headerbtn">
          <i class="hhh-icon-close"></i>
        </button>
      </div>
      <div class="hhh-dialog_body">
        <span>这是一段信息</span>
      </div>
      <div class="hhh-dialog_footer">
        <hhh-button>取消</hhh-button>
        <hhh-button type="primary">确定</hhh-button>
      </div>
    </div>
  </div>
</template>
<script>
import hhhButton from './button.vue'
export default {
  name: "dialog",
  components:{ hhhButton },
  props: {
    title: {
      type: String,
      default: ''
    },
  }
}
</script>
```
### 4.2. 第二步
> 通过父子组件之间得传值以及slot指定组件自定义title内容和样式
```vue
 <template>
  <hhh-dialog title="温馨提示">
    <!-- 使用v-slot指定插槽进行编辑 -->
    <template v-slot:title>
      <h3 style="color:red">我是标题</h3>
    </template>
  </hhh-dialog>
</template>
```

## 5. dialog组件的width、top属性
> 实现在组件调用时控制dialog组件的宽度以及位置。
<br />
只需要在父组件中传递宽度和高度，并且在子组件中获取并且使用即可。
### 5.1. 第一步
> 父组件传值
```vue
<template>
  <hhh-dialog title="温馨提示" width="80%" top="200px">
    <!-- 使用v-slot指定插槽进行编辑 -->
    <template v-slot:title>
      <h3 style="color:red">我是标题</h3>
    </template>
  </hhh-dialog>
</template>
```
### 5.2. 第二步
> 子组件使用
```vue
<div class="hhh-dialog" :style="{width:width,marginTop:top}"></div>
<script>
  export default {
    props: {
      width: {
        type: String,
        default: '50%'
      },
      top: {
        type: String,
        default: '15vh'
      },
    }
  }
</script>
```

## 6. dialog组件的定义body内容
> body内容可能是除span以外的其他内容，比如列表等，所以在这里使用插，并且在这里使用匿名插槽，
> 使用匿名插槽的好处就是在使用时不需要使用template标签指定内容，直接在组件标签下编写内容即可。
### 6.1. 第一步
> 在body中使用匿名组件
```vue
  <div class="hhh-dialog_body">
    <slot></slot>
  </div>
```
### 6.2. 第二步
> 在父组件中，只需要在标签下直接编辑内容即可，不需要再使用template标签绑定插槽或者父子组件传值了
```vue
 <hhh-dialog title="温馨提示" width="80%" top="200px">
    <!-- 使用v-slot指定插槽进行编辑 -->
    <template v-slot:title>
      <h3 style="color:red">我是标题</h3>
    </template>
<!--  body内容  -->
    <ul>
      <li>1</li>
      <li>2</li>
      <li>3</li>
    </ul>
</hhh-dialog>
```

## 7. dialog组件的定义footer内容
> footer中使用slot插槽，在父组件中的定义底部内容。
### 7.1. 第一步
> 设置footer插槽，如果没有指定footer插槽，则不显示
```vue
  <div class="hhh-dialog_footer">
    <!-- 如果footer不传递内容，则不显示footer -->
    <slot name="footer" v-if="$slots.footer"></slot>
</div>
```
### 7.2. 第二步
> 父组件中的定义footer插槽内容
```vue
 <hhh-dialog title="温馨提示" width="80%" top="200px">
<!-- title内容：使用v-slot指定插槽进行编辑 -->
    <template v-slot:title>
      <h3 style="color:red">我是标题</h3>
    </template>
<!-- body内容   -->
    <ul>
      <li>1</li>
      <li>2</li>
      <li>3</li>
    </ul>
<!-- footer内容   -->
<template v-slot:footer>
      <one-button>取消</one-button>
      <one-button type="primary">确定</one-button>
    </template>
</hhh-dialog>
```

## 8. dialog组件的显示与隐藏
> 这里需要使用到sync语法糖。
### 8.1. 第一步
父组件传输数据
- 父组件传visible属性，并在data里面把visible的值设置为false
- 添加一个button按钮用来控制dialog显示隐藏，并给button按钮一个click事件用来打开dialog
```vue
 <hhh-button @click="visible=true">按钮</hhh-button>
 <hhh-dialog title="温馨提示" width="80%" top="200px" :visible="visible"></hhh-dialog>
<script>
export default {
  data(){
    return {
      visible: false
    }
  },
}
</script>
```
### 8.2. 第二步
子组件接收数据，实现点击按钮弹出dialog
- 子组件接收visible，并用在遮罩。
```vue
 <div class="hhh-dialog_wrapper" v-show="visible"></div>
 <script>
    export default {
      name: "hhhDialog",
      props: {
        visible: {
          type: Boolean,
          default: false
        },
      },
    }
</script>
```
### 8.3. 第三步
父组件实现点击取消和确定按钮关闭弹窗
```vue
 <template v-slot:footer>
       <hhh-button @click="visible=false">取消</hhh-button>
       <hhh-button type="primary" @click="visible=false">确定</hhh-button>
     </template>
```
### 8.4. 第四步
#### 8.4.1 正常操作显示与隐藏
实现效果为点击x号和非弹框的位置，可以关闭弹框
- 给遮罩和x号click事件，并通知父组件改状态
  <br />
  注意：子组件控制dialog的显示隐藏，不能直接修改父组件传递过来的值，需要使用回调触发父组件中的值进行修改
```vue
<!--self代表只有点击自己才触发  -->
<div class="hhh-dialog_wrapper" v-show="visible" @click.self="handleClose">
  <button class="hhh-dialog_headerbtn" @click="handleClose"></button>
</div>
<script>
export default {
  methods:{
    handleClose(){
      //直接改为false，虽然弹窗关闭，但是会报错，不能直接修改父组件的值，需要通知父组件自己去改
      //this.visible=false
      this.$emit('close',false)
    }
  }
}
</script>
```
- 父组件定义自定义事件并修改值
```vue
<hhh-dialog title="温馨提示" width="80%" top="200px" :visible="visible" @close="close"></hhh-dialog>
<script>
export default {
  methods:{
    close(val){
      this.visible=val
    }
  }
}
</script>
```
#### 8.4.2. 使用sync语法糖
- 把handleClose方法改成sync形式
```vue
 handleClose(){
      this.$emit('update:visible',false)
    }
```
- 把:visible="visible"改为:visible.sync="visible"，并把close事件去掉
```vue
<hhh-dialog title="温馨提示" width="80%" top="200px" :visible.sync="visible"></hhh-dialog>
```

## 9. dialog的动画效果
> 使用transition包裹一个元素后，这个元素就会被自动添加类名，这部分vuejs文档都有介绍
### 9.1. 第一步
> 使用transition包裹整个dialog框架
```vue
<template>
  <transition name="dialog-fade">
    <div class="hhh-dialog_wrapper" v-show="visible" @click.self="handleClose">
        ···
    </div>
  </transition>
</template>
```
### 9.2. 第二步
>这里先定义了fade动画，然后在dialog组件显示和隐藏的时候调用（反向调用）这个动画
```css
/*dialog的动画效果*/
.dialog-fade-enter-active{
animation: fade .3s;
}
.dialog-fade-leave-active{
animation: fade .3s reverse;
}
@keyframes fade{
0% {
opacity: 0;
transform: translateY(-20px);
}
100%{
opacity: 1;
transform: translateY(0);
}
}
```
## 10. 组件整体代码
### 10.1. dialog.vue子组件代码
```vue
<template>
<!-- 正常操作dialog显示隐藏 -->
<!--self代表只有点击自己才触发  -->
<!--    <div class="hhh-dialog_wrapper" v-show="visible" @click.self="handleClose">
      <div class="hhh-dialog" :style="{width:width,marginTop:top}">
        <div class="hhh-dialog_header">
          <slot name="title">
            &lt;!&ndash;
            将span放到slot内，这样不仅可以定义title文本，还可以定义样式等
            利用具名插槽，如果父组件传了slot，则显示父组件插槽的title文本（子组件slot以及span标签会整体被父组件slot替换），
            不传slot，则显示传过来的title属性(span正常渲染)
            &ndash;&gt;
            <span class="hhh-dialog_title">{{title}}</span>
          </slot>
          <button class="hhh-dialog_headerbtn" @click="handleClose">
            <i class="hhh-icon-close"></i>
          </button>
        </div>
        <div class="hhh-dialog_body">
&lt;!&ndash;          <span>这是一段信息</span>&ndash;&gt;
          <slot></slot>
        </div>
        <div class="hhh-dialog_footer">
          &lt;!&ndash; 如果footer不传递内容，则不显示footer &ndash;&gt;
          <slot name="footer" v-if="$slots.footer"></slot>
        </div>
      </div>
    </div>-->
  <transition name="dialog-fade">
  <!-- sync dialog显示隐藏 -->
  <div class="hhh-dialog_wrapper" v-show="visible" @click.self="handleClose">
    <div class="hhh-dialog" :style="{width:width,marginTop:top}">
      <div class="hhh-dialog_header">
        <slot name="title">
          <!--
          将span放到slot内，这样不仅可以定义title文本，还可以定义样式等
          利用具名插槽，如果父组件传了slot，则显示父组件插槽的title文本（子组件slot以及span标签会整体被父组件slot替换），
          不传slot，则显示传过来的title属性(span正常渲染)
          -->
          <span class="hhh-dialog_title">{{title}}</span>
        </slot>
        <button class="hhh-dialog_headerbtn" @click="handleClose">
          <i class="hhh-icon-close"></i>
        </button>
      </div>
      <div class="hhh-dialog_body">
        <slot></slot>
      </div>
      <div class="hhh-dialog_footer">
        <!-- 如果footer不传递内容，则不显示footer -->
        <slot name="footer" v-if="$slots.footer"></slot>
      </div>
    </div>
  </div>
  </transition>
  </template>
<script>
import hhhButton from './button.vue'
export default {
  name: "hhhDialog",
  components:{ hhhButton },
  props: {
    title: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '50%'
    },
    top: {
      type: String,
      default: '15vh'
    },
    visible: {
      type: Boolean,
      default: false
    },
  },
  methods:{
    //<!-- 正常操作dialog显示隐藏 -->
   /* handleClose(){
      //直接改为false，虽然弹窗关闭，但是会报错，不能直接修改父组件的值，需要通知父组件自己去改
      //this.visible=false
      this.$emit('close',false)
    }*/
    handleClose(){
      this.$emit('update:visible',false)
    }
  }
}
</script>
<style lang="scss" scoped>
/*dialog的基本样式*/
.hhh-dialog_wrapper{
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  margin: 0;
  z-index: 2001;
  background-color: rgba(0,0,0,0.5);
  .hhh-dialog{
    position: relative;
    margin: 15vh auto 50px;
    background: #fff;
    border-radius: 2px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
    box-sizing: border-box;
    width: 30%;
    &_header{
      padding: 20px 20px 10px;
      .hhh-dialog_title{
        line-height: 24px;
        font-size: 18px;
        color: #303133;
      }
      .hhh-dialog_headerbtn{
        position: absolute;
        top: 20px;
        right: 20px;
        padding: 0;
        background: transparent;
        border: none;
        outline: none;
        cursor: pointer;
        font-size: 16px;
        .hhh-icon-close{
          color: #909399
        }
      }
    }
    &_body{
      padding: 30px 20px;
      color: #606266;
      font-size: 14px;
      word-break: break-all;
    }
    &_footer{
      padding: 10px 20px 20px;
      text-align: right;
      box-sizing: border-box;
      ::v-deep .hhh-button:first-child{
        margin-right: 20px;
      }
    }
  }
}
/*dialog的动画效果*/
.dialog-fade-enter-active{
  animation: fade .3s;
}
.dialog-fade-leave-active{
  animation: fade .3s reverse;
}
@keyframes fade{
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100%{
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
```
### 10.2. dialogView.vue父组件代码
```vue
<template>
 <div>
<!--   &lt;!&ndash; 正常操作dialog显示隐藏 &ndash;&gt;
   <hhh-button @click="visible=true">按钮</hhh-button>
   <hhh-dialog title="温馨提示" width="80%" top="200px" :visible="visible" @close="close">
     &lt;!&ndash; 使用v-slot指定插槽进行编辑 &ndash;&gt;
     <template v-slot:title>
       <h3 style="color:red">我是标题</h3>
     </template>
     &lt;!&ndash; body内容   &ndash;&gt;
     <ul>
       <li>1</li>
       <li>2</li>
       <li>3</li>
     </ul>
     &lt;!&ndash; footer内容   &ndash;&gt;
     <template v-slot:footer>
       <hhh-button @click="visible=false">取消</hhh-button>
       <hhh-button type="primary" @click="visible=false">确定</hhh-button>
     </template>
   </hhh-dialog>-->
   <!-- sync dialog显示隐藏 -->
   <hhh-button @click="visible=true">按钮</hhh-button>
   <hhh-dialog title="温馨提示" width="80%" top="200px" :visible.sync="visible">
     <!-- 使用v-slot指定插槽进行编辑 -->
     <template v-slot:title>
       <h3 style="color:red">我是标题</h3>
     </template>
     <!-- body内容   -->
     <ul>
       <li>1</li>
       <li>2</li>
       <li>3</li>
     </ul>
     <!-- footer内容   -->
     <template v-slot:footer>
       <hhh-button @click="visible=false">取消</hhh-button>
       <hhh-button type="primary" @click="visible=false">确定</hhh-button>
     </template>
   </hhh-dialog>
 </div>
<!--   测试sync demo
    普通传值
  <sync-demo :visible="visible" :money="money" @aa="editMoney1"></sync-demo>
   sync
   :money.sync="money"做的事情相当于定义了一个属性money（:money="money"），并注册了一个事件@aa （ @aa="editMoney1"）
  <sync-demo :money.sync="money"></sync-demo>-->
</template>
<script>
import hhhDialog from '../components/dialog.vue'
import hhhButton from '../components/button.vue'
import syncDemo from './demo/sync.vue'
export default {
  name: "dialogView",
  components:{syncDemo, hhhDialog ,hhhButton},
  data(){
    return {
      /*测试sync demo
      visible:false,
      money:100*/

      visible: false
    }
  },
  methods:{
   /*  <!-- 测试sync demo -->
   editMoney1(val){
      this.money=val
    }*/
    //<!-- 正常操作dialog显示隐藏 -->
  /*  close(val){
      this.visible=val
    }*/
  }
}
</script>
<style scoped></style>
```
### 10.3. 效果
![](https://cdn.jsdelivr.net/gh/abander/img@main/vuepress-theme-vdoing/20220421182217.png)

## 11. dialog封装知识点加强
### 11.1. solt
> 父级模板里的所有内容都是在父级作用域中编译的；子模板里的所有内容都是在子作用域中编译的。
组件插槽的目的是为了让我们封装的组件具有更好的扩展性
#### 11.1.1. 匿名插槽
使用匿名插槽的好处就是在使用时不需要使用template标签指定内容，直接在组件标签下编写内容即可。
#### 11.1.2. 具名插槽
普通具名插槽
```vue
// 组件
Vue.component('lv-hello', {
  template: `
    <div>
      <slot name="header"></slot>
      <h1>我的天呀</h1>
    </div>
  `
})
<div id="app">
  <!-- 新版本使用具名插槽 -->
  <lv-hello>
    <!-- 注意：这块的 v-slot 指令只能写在 template 标签上面，而不能放置到 p 标签上 -->
    <template v-slot:header>
      <p>我是头部</p>
    </template>
  </lv-hello>
</div>
```
简写具名插槽 : 将v-slot:替换成#号
```vue
<div id="app">
  <lv-hello>
    <template #header>
      <p>我是头部</p>
    </template>
    <!-- 注意: #号后面必须有参数，否则会报错。即便是默认插槽，也需要写成 #default -->
    <template #default>
      <p>我是默认插槽</p>
    </template>
  </lv-hello>
</div>
```
#### 11.1.3. 作用域插槽
所谓作用域插槽，就是让插槽的内容能够访问子组件中才有的数据。
```vue
Vue.component('lv-hello', {
  data: function () {
    return {
      firstName: '张',
      lastName: '三'
    }
  },

  template: `
    <div>
      <slot name="header" :firstName="firstName" :lastName="lastName"></slot>
      <h1>我的天呀</h1>
    </div>
  `
})
<div id="app">
  <!-- 老版本使用具名插槽 -->
  <lv-hello>
    <p slot="header" slot-scope="hh">我是头部 {{ hh.firstName }} {{ hh.lastName }}</p>
  </lv-hello>
  <!-- 新版本使用具名插槽 -->
  <lv-hello>
    <!-- 注意：这块的 v-slot 指令只能写在 template 标签上面，而不能放置到 p 标签上 -->
    <template v-slot:header="hh">
      <p>我是头部 {{ hh.firstName }} {{ hh.lastName }}</p>
    </template>
  </lv-hello>
</div>
```

### 11.2. sync
> sync通俗来说，是父子组件传值过程中提供的一种模式，这种模式有两个功能：一是将父组件向子组件传值；二是子组件回调一个值给父组件。
<br />
例如：如下代码需要两步才能实现上述功能：1.向子组件传值；2.接收子组件回调的值
#### 11.2.1. 示例：普通修改
```vue
//父组件传值
<sync-demo :visible="visible" :money="money" @aa="editMoney1"></sync-demo>
data(){
    return {
        visible:false,
        money:100
    }
},
methods:{
    editMoney1(val){
    this.money=val
   }
//子组件接收
<div>
<div>demo---{{money}}</div>
<button @click="fn">普通修改money</button>
</div>

props:{
    visible: {
        type: Boolean,
        default: false
    },
    money: null
},
methods:{
    fn(){
    this.$emit('aa',200)
    }
}
```
#### 11.2.2. 示例：sync语法糖
> 使用sync语法糖后，父组件不需要单独声明一个方法，只需要在回调时声明一个update绑定的回调函数（这个绑定值是传值自身）这样在父组件中就不需要再次定义回调函数进行接收了。
- 父组件传值  :money.sync
- 子组件触发  this.$emit('update:money',200)
```vue
//父组件中的使用sync语法糖，传递和接收参数
<!-- :money.sync="money"做的事情相当于定义了一个属性money（:money="money"），并注册了一个事件@aa （ @aa="editMoney1"）-->
<sync-demo :money.sync="money"></sync-demo>
//子组件中使用update绑定参数的方法进行回调
methods: {
    fn () {
    this.$emit('update:money',200)
    }
} 
```

### 11.3. scoped的作用
- scoped会给当前组件的模板中所有的元素加上一个随机的属性
- scoped会给当前组件中所有的样式加上一个随机的属性选择器
  <br />
  加了scoped
  ![](https://cdn.jsdelivr.net/gh/abander/img@main/vuepress-theme-vdoing/20220421184253.png)

### 11.4. 深度选择器
深度选择器加上之后不会对你的样式加上随机的属性选择器
- `::v-deep` 深度选择器 scss
- `/deep/`  深度选择器 less
- `>>>` 深度选择器 css
