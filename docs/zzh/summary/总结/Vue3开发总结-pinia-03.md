---
title: Vue3开发总结-pinia-03
date: 2022-12-02 13:07:47
sidebar: auto
author: Zzh
tags:
  - Vue3
  - pinia
categories:
  - 总结
description: Pinia 是 Vue 的存储库，它支持vue2和vue3。因此在写项目中，我们可以使用pinia代替vuex,就我个人而言，我觉得pinia使用起来方便的多。

---

# Vue3开发总结-pinia-03
::: tip pinia
Pinia 是 Vue 的存储库，它支持vue2和vue3。因此在写项目中，我们可以使用pinia代替vuex,就我个人而言，我觉得pinia使用起来方便的多。
与 Vuex 相比，Pinia 提供了一个更简单的 API，具有更少的规范，提供了 Composition-API 风格的 API，最重要的是，在与 TypeScript 一起使用时具有可靠的类型推断支持。
:::

[pinia](https://pinia.vuejs.org/zh/)
```javascript
pnpm install pinia
```
## 相关概念
Pinia从使用角度和之前的Vuex一样。

* state：存储全局状态

* getters：类似于Vue的computed，根据已有state封装派生数据，也具有**缓存的特性**

* actions：用来封装业务逻辑，支持同步和异步

## 使用

### 目录结构
<a-image src="https://cdn.jsdelivr.net/gh/zhihao2030/note-img@main/20221202172116.png" />

```javascript
// /store/index.js
import { createPinia } from 'pinia';

const pinia = createPinia();

export default function setupPinia (app) {
    app.use(pinia)
}

```

### defineStore定义容器

```js
import { defineStore } from 'pinia'

// 第一个参数是应用程序中 store 的唯一 id
export const useUserStore = defineStore('user', {
  state: {
      userInfo: {}
      ...
  },
  getters: {},
  actions:{}
})
```

### 使用store
::: danger 注意
直接对store进行结构取值，会丢失响应
:::
```js
<script setup>
const store = useUserStore()

 // 这不起作用，因为它会破坏响应式
 // 这和从 props 解构是一样的    
 const { userInfo } = store

</script>
```

::: tip **storeToRefs**
为了从 Store 中提取属性同时保持其响应式，需要使用storeToRefs()。 它将为任何响应式属性创建 refs。
:::

```js
<script setup>
import { storeToRefs } from 'pinia'    
    
const store = useUserStore()
// 使用storeToRefs使结构出的状态具有响应式    
const { userInfo } = storeToRefs(store)

</script>
```

### $reset重置状态
调用store 上的 $reset() 方法将状态 重置 到其初始值

```js
<script setup>
import { storeToRefs } from 'pinia'    
    
const store = useUserStore()
// 使用storeToRefs使结构出的状态具有响应式    
const { userInfo } = storeToRefs(store)

const resetState = () => {
    store.$reset()
}    
</script>
```
### 改变state状态

#### 直接设置
```js
<script setup>
import { storeToRefs } from 'pinia'    
    
const store = useUserStore()
  
const { userInfo } = storeToRefs(store)

const handleChange = () => {
    store.userInfo = {xxx:xxx}
}    
</script>
```

#### $patch 修改多个状态
```js
<script setup>
import { storeToRefs } from 'pinia'    
    
const store = useUserStore()
  
const { userInfo } = storeToRefs(store)

const handleChange = () => {
    const changeData = {
        userInfo: {xxx:xxx},
        ruleList: []
    }   
    /*
    * 
    * 将会同时修改store中的userInfo，ruleList
    * */
    store.$patch(changeData)
}    
</script>
```

#### 在action中定义一个方法进行更新状态
```js
import { defineStore } from 'pinia'

// 第一个参数是应用程序中 store 的唯一 id
export const useUserStore = defineStore('user', {
  state: {
      userInfo: {}
      ...
  },
  getters: {},
  actions:{
      setUserInfo(payload) {
          this.userInfo = payload
      }
  }
})
```
### 订阅状态
相当于watch Store中的state

#### 使用Vue中的watch
```js
watch(
  pinia.state,
  (state) => {
    // doSomething
    
  },
  { deep: true }
)
```

#### $subscribe()
可以通过 store 的 $subscribe() 方法查看状态及其变化，类似于 Vuex 的 subscribe 方法
默认情况下，state subscriptions 绑定到添加它们的组件（如果 store 位于组件的 setup() 中）。
当组件被卸载时，它们将被自动删除。 如果要在卸载组件后保留它们，请将 { detached: true } 作为第二个参数传递给 detach 当前组件的 state subscription：
```js
import { storeToRefs } from 'pinia'

const store = useUserStore()

const callback = (mutation, state) => {}

// 此订阅将和组件一起卸载
store.$subscribe(callback)

// 此订阅将在组件卸载后保留
store.$subscribe(callback, { detached: true })
```


::: tip watch 于 $subscribe() 区别
与常规的 watch() 相比，使用 $subscribe() 的优点是 subscriptions 只会在 patches 之后触发一次
:::

## 数据持久化  [pinia-plugin-persistedstate](https://github.com/l-x-f/pinia-persistedstate-plugin#readme)
使用 `pinia-plugin-persistedstate` 实现数据持久化

```javascript
// /store/index.js
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export default function setupPinia (app) {
    app.use(pinia)
}

```

```js
// 使用 pinia-plugin-persistedstate 后，会多出个 persist 配置项
import { defineStore } from 'pinia'

// 第一个参数是应用程序中 store 的唯一 id
export const useUserStore = defineStore('user', {
  persist: {
      enabled: true,
      strategies: [
          {
              // 存储名称
              key: 'piniaStore',
              //保存的位置
              storage: localStorage,
              // 自定义持久化状态
              paths: ['userInfo']
          },
          // 自定义
/*        { storage: sessionStorage, paths: ['userInfo'] },
          { storage: localStorage, paths: ['xxx'] }
*/
      ]
      
  },
  state: {
      userInfo: {}
      ...
  },
  getters: {},
  actions:{}
})
```

## [在组件外使用store](https://pinia.vuejs.org/zh/core-concepts/outside-component-usage.html)

```js
import {defineStore} from 'pinia'
import store from './index'

// 第一个参数是应用程序中 store 的唯一 id
export const useUserStore = defineStore('user', {
    state: {
        userInfo: {}
        ...
    },
    getters: {},
    actions: {}
})

// 需要在setup之外使用
export function useUserStoreWithOut() {
    return useUserStore(store);
}
```

