---
title: 浮动
date: 2023-02-08 17:08:09
sidebar: auto
author: Smq
tags:
  - css3
categories:
  - 总结
description: 浮动
---

# 浮动

::: tip 前言
浮动
:::

## 1. 浮动的简介
> 通过浮动可以使一个元素向其父元素的左侧或右侧移动
>
使用 float 属性来设置于元素的浮动 ， 可选值：
- none 默认值 ，元素不浮动
- left 元素向左浮动
- right 元素向右浮动

> 注意：元素设置浮动以后，水平布局的等式便不需要强制成立。
元素设置浮动以后，会完全从文档流中脱离，不再占用文档流的位置，
所以元素下边的还在文档流中的元素会自动向上移动
>

## 2. 浮动的特点
- 浮动元素会完全脱离文档流，不再占据文档流中的位置
- 设置浮动以后元素会向父元素的左侧或右侧移动，
- 浮动元素默认不会从父元素中移出
- 浮动元素向左或向右移动时，不会超过它前边的其他浮动元素
- 如果浮动元素的上边是一个没有浮动的块元素，则浮动元素无法上移
- 浮动元素不会超过它上边的浮动的兄弟元素，最多最多就是和它一样高
- 浮动元素不会盖住文字，文字会自动环绕在浮动元素的周围，所以我们可以利用浮动来设置文字环绕图片的效果

> 简单总结：浮动目前来讲主要作用就是让页面中的元素可以水平排列，通过浮动可以制作一些水平方向的布局
>

## 3.脱离文档流的特点
> 元素设置浮动以后，将会从文档流中脱离，从文档流中脱离后，元素的一些特点也会发生变化
>
### 3.1. 块元素
- 块元素不在独占页面的一行
- 脱离文档流以后，块元素的宽度和高度默认都被内容撑开
### 3.2. 行内元素
- 行内元素脱离文档流以后会变成块元素，特点和块元素一样
- 脱离文档流以后，不需要再区分块和行内了

## 4. 高度塌陷
> 在浮动布局中，父元素的高度默认是被子元素撑开的，
当子元素浮动后，其会完全脱离文档流，子元素从文档流中脱离，
将会无法撑起父元素的高度，导致父元素的高度丢失
父元素高度丢失以后，其下的元素会自动上移，导致页面的布局混乱
所以高度塌陷是浮动布局中比较常见的一个问题，这个问题我们必须要进行处理！
>
### 4.1. BFC
#### 4.1.1. BFC(Block Formatting Context) 块级格式化环境
- BFC是一个CSS中的一个隐含的属性，可以为一个元素开启BFC
- 开启BFC该元素会变成一个独立的布局区域
#### 4.1.2. 元素开启BFC后的特点
- 开启BFC的元素不会被浮动元素所覆盖
- 开启BFC的元素子元素和父元素外边距不会重叠
- 开启BFC的元素可以包含浮动的子元素
#### 4.1.3. 开启元素的BFC方法
- 设置元素的浮动（不推荐）：下方元素会被覆盖了，总不能让所有元素都浮动吧
- 将元素设置为行内块元素（不推荐）：不再独占一行，宽度变了，同时与下方元素产生了一点空隙
- 将元素的overflow设置为一个非visible的值：既没有覆盖元素，也保持了独占一方的特性（保持了宽度），与下方元素也保持了最初的间隙
    - scroll（不推荐）：会有滚动条，可能并不需要的
    - hidden/auto（常用方式）：开启其BFC 以使其可以包含浮动元素
      <br />
      注：不过，overflow：hidden；这种方式也存在一定问题，overflow并没有完全清除div2布局上受到的影响。
      <br />
      例子：两个div兄弟元素（都有width、height、background-color），第一个div1设置浮动，另一个div2设置overflow：hidden；想让黄块div1在蓝块div2上面，现在是黄快在蓝块的左边
#### 4.1.4. 总结
开启BFC不是解决浮动的好方案！
#### 4.1.5. 代码
```css
    .outer{
        border:10px olive solid;
        /*设置浮动（不推荐)，会覆盖down元素*/
        /* float: left; */
        /*设置行内块元素（不推荐)，不再独占一行，宽度变了*/
        /*display:inline-block;*/
        /*设置overflow设置为非visible的值*/
        overflow: hidden;
        overflow: scroll;
        overflow: auto;
    }

    .inner{
        /*子元素设置宽度，父元素默认被撑开*/
        width: 200px;
        height: 200px;
        background-color: orange;
        /*设置float后，父元素会出现高度塌陷*/
        float: left;
    }

    .down{
        width: 300px;
        height: 300px;
        background-color: dodgerblue;
    }
```
```vue
  <div class="outer">
    <div class="inner"></div>
  </div>
  <div class="down"></div>
```
### 4.2. clear
#### 4.2.1. 作用
清除浮动元素对当前元素所产生的影响
#### 4.2.2. 可选值
- left 清除左侧浮动元素对当前元素的影响
- right 清除右侧浮动元素对当前元素的影响
- both 清除两侧中最大影响的那侧
#### 4.2.3. 原理
设置清除浮动以后，浏览器会自动为元素添加一个上外边距，以使其位置不受其他元素的影响
#### 4.2.4. 问题及解决
#### 4.2.4.1. 问题
设计三个兄弟元素，对前两个元素进行float的浮动属性设置，由于box1的浮动，
导致box3位置上移也就是box3受到了box1浮动的影响，位置发生了改变，但是文字并没有被覆盖。
如果我们不希望某个元素因为其他元素浮动的影响而改变位置，可以通过clear属性来清除浮动元素对当前元素所产生的影响
```css
     div{
        font-size: 50px;
        }
    .box1{
        width: 200px;
        height: 200px;
        background-color: #bfa;
        float: left;
    }
    .box2{
        width: 400px;
        height: 150px;
        background-color: #ff0;
        float: right;
    }
    .box3 {
        width: 200px;
        height: 200px;
        background-color: orange;
    }
```
```vue
    <div class="box1">1</div>
    <div class="box2">2</div>
    <div class="box3">3</div> 
```
#### 4.2.4.2. 解决
给box3加上clear:left/right/both; 可以解决位置影响问题

### 4.3. after解决高度塌陷
#### 4.3.1. 解决高度塌陷方法（有弊端）
- 通过overflow: hidden等可以为元素开启BFC
- 通过clear: both等可以清除浮动对元素产生的影响
  <br />
  注：同时也了解到，这两种方式都有一定的弊端和隐患
#### 4.3.2. 真正方法
给box1加上after伪元素等同于额外便签法。
<br />
注意：after伪元素中的三个元素必写。
```css
.box1{
    border: 10px red solid;
}
.box2{
    width: 100px;
    height: 100px;
    background-color: #bfa;
    float: left;
}
/*额外便签法*/
.box3{
    clear: both;
}
/*after伪元素*/
.box1::after{
    content: '';
    display: block;
    clear: both;
}
```
### 4.4. before解决外边距重叠
#### 4.4.1. 问题
```css
.box1{
    width: 200px;
    height: 200px;
    background-color: deeppink;
}

.box3{
    width: 100px;
    height: 100px;			
    background-color: blue;
    margin-top: 100px;
}
```
```vue
<div class="box1">
		<div class="box3"></div>
	</div>
```
运行发现不是box3往下走，而是父元素box1往下走100px，因为父类容器没有border和padding的时候父元素box1和之元素box3的外边距发生重叠，
子元素的外边距传递给了父元素的（当然我们可以给父元素border和padding但是不是完美的解决方案）
#### 4.4.2. 解决
在BFC中给box1启用BFCoverflow:hidden可以解决此问题，但是在某些时候有副作用.
我们可以使用.box1::before伪元素完美解决
```css
.box1::before{
    content: '';
    display: table;
}
```

### 4.5. 同时解决高度塌陷和外边距重叠方法：clearfix
clearfix 这个样式可以同时解决高度塌陷和外边距重叠的问题，当你在遇到这些问题时，直接使用clearfix这个类即可
```css
  .clearfix::before,
    .clearfix::after {
        content: '';
        display: table;
        clear: both;
    }
```

### 4.6. 总结解决方案:
#### 4.6.1. 解决高度塌陷
- 给父元素设置固定高度
- 给父元素设置overflow属性（子元素有下拉框不用overflow属性）
- 给父元素也设置成浮动（bfc:block formatting context 块级格式化区域(上下文）
- 清除浮动：clean:both;
- 额外标签法
- (最优方案)给父元素设置clearfix::after伪元素,调clearFix类名
```css
 .cleanfix::after {
    content:'';
    display:block;
    clean:both;
    }
```
#### 4.6.2. 解决外边距重叠
```css
  .clearfix::before {
        content: '';
        display: table;
        clear: both;
    }
```
#### 4.6.3. 解决高度塌陷和外边距重叠
```css
.clearfix::before,
    .clearfix::after {
        content: '';
        display: table;
        clear: both;
    }
```

## 5. 简单布局
### 5.1. 目的
- 熟悉布局（块元素、浮动）
- 公共css部分复用
- 复习语义标签
### 5.2. 代码
#### 5.2.1. html代码
```vue
<!-- 页眉 -->
<header></header>
<!-- 主体 -->
<main>
    <!-- 左边栏 -->
    <nav></nav>
    <!-- 中心 -->
    <article>
        <!-- 内容上 -->
        <div class="top"></div>
        <!-- 内容下 -->
        <div class="bottom">
            <!-- 内容左 -->
            <div class="left"></div>
            <!-- 内容中 -->
            <div class="middle"></div>
            <!-- 内容右 -->
            <div class="right"></div>
        </div>
    </article>
    <!-- 右边栏 -->
    <aside></aside>
</main>
<!-- 页脚 -->
<footer></footer>
```
#### 5.2.2. css代码
```css
/* 公共部分 */
header,
main,
footer {
    width: 1000px;
    margin: 10px auto;
}

main nav,
main article,
main aside {
    float: left;
    /* 虽然设置浮动了，但整体大小是被内容撑开的，所以设置一个高度 */
    height: 100%;
}

.bottom .left,
.bottom .middle,
.bottom .right {
    float: left;
    width: 220px;
    height: 100%;
}

/* ==========整体布局-上========== */
header {
    height: 100px;
    background-color: silver;
}

/* ==========整体布局-中========== */
main {
    height: 400px;
    background-color: #bfa;
}


/* ------左边栏------ */
main nav {
    width: 150px;
    background-color: red;
}

/* ------中心------ */
main article {
    width: 680px;
    background-color: green;
    margin: 0 10px;
}

/* ---上--- */
article .top {
    height: 190px;
    background-color: yellow;
    margin-bottom: 10px;
}

/* ---下--- */
article .bottom {
    height: 200px;
    background-color: orange;
}


/* 左 */
.bottom .left {
    background-color: lightblue;
}

/* 中 */
.bottom .middle {
    background-color: gray;
    margin: 0 10px;
}

/* 右 */
.bottom .right {
    background-color: wheat;
}

/* ------右边栏------ */
main aside {
    width: 150px;
    background-color: blue;
}

/* ==========整体布局-下========== */
footer {
    height: 100px;
    background-color: tomato;
}
```
#### 5.2.3. 效果
![](https://cdn.jsdelivr.net/gh/abander/img@main/vuepress-theme-vdoing/20220415161550.png)



















