---
title: inheritAttrs
date: 2023-02-13 10:22:12
sidebar: auto
author: Smq
tags:
  - 封装知识点
categories:
  - 总结
description: inheritAttrs
---

# inheritAttrs

::: tip 前言
二次封装组件，通过$attrs接收父组件的属性，只接受属性，不需要把接收的属性显示到根标签上，通过inheritAttrs: false,可以解决
:::

## 1.例子
> 父组件传 maxLength、row属性，子组件只有rows在props接收了。
> 父组件
```vue
<k-input
    v-model="input"
    type="main"
    placeholder="请输入"
    max-length="20"
    rows="3"
/>
```

> 子组件
```vue
<template>
  <el-input
      ref="k-input"
      :class="config.rootName"
      v-bind="{...config.attrs,...$attrs,...typeInput, rows, disabled}"
      :style="inputSize"
      v-on="$listeners"
  >
    <template
        v-for="(index,name) in Object.keys($slots)"
        :slot="name"
    >
      <slot :name="name" />
    </template>
  </el-input>
</template>
<script>
export default {
  name: 'KInput',
  // inheritAttrs: false,
  props: {
    // type类型
    type: {
      type: String,
      default: 'main'
    },
    // disabled属性
    disabled: {
      type: Boolean,
      default: false
    },
    // 类型
    types: {
      type: String,
      default: 'text'
    },
    rows: {
      type: String,
      default: '2'
    },
    width: {
      type: String,
      default: '200px'
    }
  },
}
</script>
```

> 不加inheritAttrs：false，效果如图所示，在props定义的rows没有显示到根标签中，不被props定义的maxLength属性显示到了根标签中。
![](https://cdn.jsdelivr.net/gh/abander/img@main/vuepress-theme-vdoing/20230213135547.png)
> 加inheritAttrs：false，效果如图所示，maxLength、rows属性都不在根标签中。
![](https://cdn.jsdelivr.net/gh/abander/img@main/vuepress-theme-vdoing/20230213135725.png)
## 2.总结
- 在标签内添加$attrs可以渲染上未注册的属性
- inheritAttrs:true 是允许组件绑定的未注册属性渲染到组件根节点上的
