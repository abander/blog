---
title: Vue3 keepAlive组件源码
date: 2022-12-30 14:46:42
sidebar: auto
author: Zzh
tags:
  - Vue
  - keepAlive
categories:
  - 源码
description: KeepAlive组件是Vue中的内置组件，主要用于保留组件状态或者避免组件重新渲染。
---

# Vue3 keepAlive组件源码

`KeepAlive`组件是Vue中的内置组件，主要用于保留组件状态或者避免组件重新渲染。

## 1. 基本用法

```vue
<keep-alive :include="['a', 'b']" :max="10">
  <component :is="view"></component>
</keep-alive>
```

## 2. Props

`KeepAlive`组件接受三个`Props`属性：

- `include` - `string | RegExp | Array`。只有名称匹配的组件会被缓存。
- `exclude` - `string | RegExp | Array`。任何名称匹配的组件都不会被缓存。
- `max` - `number | string`。最多可以缓存多少组件实例。

## 3. 源码实现

```js
const KeepAliveImpl = {
  name: `KeepAlive`,

  // 私有属性 标记 该组件是一个KeepAlive组件
  __isKeepAlive: true,
  props: {
    // 用于匹配需要缓存的组件
    include: [String, RegExp, Array],
    // 用于匹配不需要缓存的组件
    exclude: [String, RegExp, Array],
    // 用于设置缓存上线
    max: [String, Number]
  },
  setup(props, { slots }) {
    // 省略部分代码...

    // 返回一个函数

      // 如果当前的 KeepAlive 组件没有子组件的话，直接 return   
  return () => {
      if (!slots.default) {
        return null
      }

      // 省略部分代码...

      // 获取子节点
      const children = slots.default()
      // 获取第一个子节点
      const rawVNode = children[0]
      // 返回原始Vnode
      return rawVNode
    }
  }
}
```

::: tip  KeepAlive返回的是什么？

通过上面的代码可以知道，`KeepAlive`组件是一个**抽象组件**。

组件中并没有我们经常使用的模板`template`或者返回一个`render`函数。

在`setup`函数中，通过参数`slots.default()`获取到`KeepAlive`组件包裹的子组件列表。

最终返回的是**第一个子组件**的`rawVnode`。且仅支持缓存第一个子节点。

:::

### keepAlive 缓存组件的实现

在使用`KeepAlive`时，我们可以通过配置`include` & `exclude`属性来实现对目标组件的缓存。`include` & `exclude` 属性可以配置`string`、`array`、`regExp`类型。

```js
const KeepAliveImpl = {
  setup(props, { slots }) {
    /* 1 */
    // 缓存Vnode
    const cache: Cache = new Map()
    // 记录被缓存Vnode的key
    const keys: Keys = new Set()

    /* 2 */
    // 修剪缓存
    function pruneCache(filter) {
      cache.forEach((vnode, key) => {
        // 获取组件名称
        const name = getComponentName(vnode.type) 
        if (name && (!filter || !filter(name))) {
          pruneCacheEntry(key)
        }
      })
    }
    function pruneCacheEntry(key) {
      // 省略部分代码...
      cache.delete(key)
      keys.delete(key)
    }

    /* 3 */
    // prune cache on include/exclude prop change
    // 侦测筛选条件，当include/exclude发生变化的时候，更新缓存
    watch(
      () => [props.include, props.exclude],
      ([include, exclude]) => {
        include && pruneCache(name => matches(include, name))
        exclude && pruneCache(name => !matches(exclude, name))
      },
      // prune post-render after `current` has been updated
      { flush: 'post', deep: true }
    )

    return () => {

      // 省略部分代码...

      const children = slots.default()
      const rawVNode = children[0] 
      let vnode = getInnerChild(rawVNode)
      const comp = vnode.type

      // for async components, name check should be based in its loaded
      // inner component if available
      // 对于异步组件 名称校验应该基于被加载的组件
      const name = getComponentName(
        isAsyncWrapper(vnode)
          ? (vnode.type).__asyncResolved || {}
          : comp
      )
      const { include, exclude, max } = props

      /* 4 */
      // 筛选Vnode
      if (
        (include && (!name || !matches(include, name))) ||
        (exclude && name && matches(exclude, name))
      ) {
        current = vnode
        return rawVNode
      }

      const key = vnode.key == null ? comp : vnode.key
      // 从缓存中获取Vnode
      const cachedVNode = cache.get(key)


      if (cachedVNode) {
         // 省略部分代码...
      } else {
        // 如果先前没有缓存Vnode
        // 则直接添加
        keys.add(key)

        /* 5 */
        // prune oldest entry
        // 删除最旧的
        if (max && keys.size > parseInt(max, 10)) {
          pruneCacheEntry(keys.values().next().value)
        }
      }

    }
  }
}
```

**分析：**

1. `cache`用于映射缓存组件的`key : Vnode`，`keys`用于记录已经被缓存的`Vnode`的`key`

2. 负责修剪`cache`、`keys`的`pruneCache`、`pruneCacheEntry`方法。主要职责是通过遍历`cache`，执行`filter`函数，修剪`cache`、`keys`。

3. 负责侦测筛选条件的`watch`，当筛选条件发生变化的时候，会执行`pruneCache`，更新`cache`、`keys`。筛选条件就是我们传入的props中的`include`、`exclude`。
   
   **删除不在include中的key， 与在exclude中的key**

4. 筛选符合筛选条件的`Vnode`，不符合缓存条件的，会直接返回`rawVnode`，不会被`cache`、`keys`缓存。

5. KeepAlive 缓存机制使用的是 LRU 算法(Least Recently Used)

### 缓存机制

KeepAlive 缓存机制使用的是 LRU 算法(Least Recently Used)，当数据在最近一段时间被访问，那么它在以后也会被经常访问。这就意味着，如果经常访问的数据，我们需要能够快速命中，而不常访问的数据，我们在容量超出限制，要将其淘汰。

```js
const KeepAliveImpl = {
  setup(props){
    // 缓存KeepAlive子节点的数据结构{key:vNode}  
    const cache: Cache = new Map()
    // 保存KeepAlive子节点唯一标识的数据结构
    const keys: Keys = new Set()
    let current: VNode | null = null

    let pendingCacheKey: CacheKey | null = null

    // 在beforeMount/Update 缓存子树
    const cacheSubtree = () => {
      if (pendingCacheKey != null) {
        cache.set(pendingCacheKey, instance.subTree)
      }
    }
    onMount(cacheSubtree)
    onUpdate(cacheSubtree)

    return ()=>{
      pendingCacheKey = null

      const children = slots.default()
      let vnode = children[0]

      const comp = vnode.type as Component
      const name = getName(comp)
      // 解构出属性值
      const { include, exclude, max } = props
      // key值是KeepAlive子节点创建时添加的，作为缓存节点的唯一标识
      const key = vnode.key == null ? comp : vnode.key
      // 通过key值获取缓存节点
      const cachedVNode = cache.get(key)

      if (cachedVNode) {
        // 缓存存在，则使用缓存装载数据
        vnode.el = cachedVNode.el
        vnode.component = cachedVNode.component
        if (vnode.transition) {
          // 递归更新子树上的 transition hooks
          setTransitionHooks(vnode, vnode.transition!)
        }
        // 阻止vNode节点作为新节点被挂载
        vnode.shapeFlag |= ShapeFlags.COMPONENT_KEPT_ALIVE
        // 让key始终新鲜
        keys.delete(key)
        keys.add(key)
      } else {
        keys.add(key)
        // 属性配置max值，删除最久不用的key，这很符合LRU的思想
        if (max && keys.size > parseInt(max as string, 10)) {
          pruneCacheEntry(keys.values().next().value)
        }
      }
      // 避免vNode被卸载
      vnode.shapeFlag |= ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE
      current = vnode
      return vnode;
    }
  }
}
// subTree: 记录当前组件实例的render方法返回的vnode
```

**分析：**

1. keys 内缓存组件的唯一标识 key

2. keys 缓存容器中的数据，越靠前的 key 值越少被访问越旧，往后的值越新鲜

3. 渲染函数执行时，若命中缓存时，则从 keys 中删除当前命中的 key，并往 keys 末尾追加 key 值，保存新鲜

4. 未命中缓存时，则 keys 追加缓存数据 key 值，若此时缓存数据长度大于 max 最大值，则删除最旧的数据，这里的值是 keys 中第一个值，很符合 LRU 思想。

5. `Vnode`的`cache`构建，是在`KeepAlive`组件的`onMounted` && `onUpdated`两个生命周期通过`cacheSubtree`方法构建的。

6. 变量`pendingCacheKey`主要用于记录处理`pending`状态的`key`

7. 如果组件的`Vnode`先前被`Vnode`被缓存过，在获取到`cachedVNode`之后，会更新`keys`中对应的`key`。

### 清空缓存

```js
const KeepAliveImpl = {
  setup(props, { slots }) { 
       // 卸载
    function unmount(vnode) {
      // reset the shapeFlag so it can be properly unmounted
      resetShapeFlag(vnode)
      _unmount(vnode, instance, parentSuspense)
    }


    onBeforeUnmount(() => {
      cache.forEach(cached => {
        const { subTree, suspense } = instance
        const vnode = getInnerChild(subTree)
        if (cached.type === vnode.type) {
          // current instance will be unmounted as part of keep-alive's unmount
          resetShapeFlag(vnode)

          // ！:非空类型断言
          // but invoke its deactivated hook here
          const da = vnode.component!.da
          da && queuePostRenderEffect(da, suspense)
          return
        }
        // 清理缓存
        unmount(cached)
      })
    })
  }
}
```

::: tip 卸载

当缓存的 vnode 为当前 KeepAlive 组件渲染的 vnode 时，重置 vnode 的 ShapeFlag，让它不被当做是 KeepAlive 的 vNode，然后通过 queuePostRenderEffect 执行子组件的 deactivated 函数，这样就完成了卸载逻辑。否则，则执行 unmount 方法执行 vnode 的整套卸载路程。

:::

## 完整源码

```js
const KeepAliveImpl: ComponentOptions = {
  name: `MyKeepAlive`,
  __isKeepAlive: true,

  props: {
    include: [String, RegExp, Array],
    exclude: [String, RegExp, Array],
    max: [String, Number],
  },

  setup(props: MyKeepAliveProps, { slots }: SetupContext) {
    // 获取当前的 KeepAlive 组件实例
    const instance = getCurrentInstance()!;
    // 获取组件实例的 ctx 属性，这个属性对象中存储有渲染器
    const sharedContext = instance.ctx as KeepAliveContext;

    // if the internal renderer is not registered, it indicates that this is server-side rendering,
    // for KeepAlive, we just need to render its children
    if (__SSR__ && !sharedContext.renderer) {
      return () => {
        const children = slots.default && slots.default();
        return children && children.length === 1 ? children[0] : children;
      };
    }

    // 用于缓存组件的一个 Map 实例，键是组件 VNode 的 key，值是组件的 VNode
    const cache: Cache = new Map();

    // 用于存储缓存组件 key 的 Set 实例
    const keys: Keys = new Set();

    // 用于存储当前 KeepAlive 组件的子组件的 VNode
    let current: VNode | null = null;

    if (__DEV__ || __FEATURE_PROD_DEVTOOLS__) {
      (instance as any).__v_cache = cache;
    }

    const parentSuspense = instance.suspense;

    // 获取 sharedContext 中保存的渲染器方法
    const {
      renderer: {
        p: patch,
        m: move,
        um: _unmount,
        o: { createElement },
      },
    } = sharedContext;

    // 用于存储缓存组件 DOM 的容器
    const storageContainer = createElement('div');
    // 封装两个工具函数到 instance.ctx 中，这两个工具函数会在渲染器中的 processComponent 和 unmount 函数中使用
    // 当渲染器发现 VNode 是经过 KeepAlive 处理缓存过的话，会使用这两个自定义函数进行处理，不会使用渲染器中的默认操作进行处理
    sharedContext.activate = (vnode, container, anchor, isSVG, optimized) => {
      const instance = vnode.component!;
      move(vnode, container, anchor, MoveType.ENTER, parentSuspense);
      // in case props have changed
      patch(
        instance.vnode,
        vnode,
        container,
        anchor,
        instance,
        parentSuspense,
        isSVG,
        vnode.slotScopeIds,
        optimized,
      );
      queuePostRenderEffect(() => {
        instance.isDeactivated = false;
        if (instance.a) {
          invokeArrayFns(instance.a);
        }
        const vnodeHook = vnode.props && vnode.props.onVnodeMounted;
        if (vnodeHook) {
          invokeVNodeHook(vnodeHook, instance.parent, vnode);
        }
      }, parentSuspense);

      if (__DEV__ || __FEATURE_PROD_DEVTOOLS__) {
        // Update components tree
        devtoolsComponentAdded(instance);
      }
    };

    // 将失活组件的真实 DOM 隐藏到 storageContainer 中
    sharedContext.deactivate = (vnode: VNode) => {
      const instance = vnode.component!;
      // 将之前已经渲染的 DOM 从 storageContainer 中移动到 container 中
      move(vnode, storageContainer, null, MoveType.LEAVE, parentSuspense);
      queuePostRenderEffect(() => {
        if (instance.da) {
          invokeArrayFns(instance.da);
        }
        const vnodeHook = vnode.props && vnode.props.onVnodeUnmounted;
        if (vnodeHook) {
          invokeVNodeHook(vnodeHook, instance.parent, vnode);
        }
        instance.isDeactivated = true;
      }, parentSuspense);

      if (__DEV__ || __FEATURE_PROD_DEVTOOLS__) {
        // Update components tree
        devtoolsComponentAdded(instance);
      }
    };

    function unmount(vnode: VNode) {
      // reset the shapeFlag so it can be properly unmounted
      resetShapeFlag(vnode);
      _unmount(vnode, instance, parentSuspense, true);
    }

    function pruneCache(filter?: (name: string) => boolean) {
      cache.forEach((vnode, key) => {
        const name = getComponentName(vnode.type as ConcreteComponent);
        if (name && (!filter || !filter(name))) {
          pruneCacheEntry(key);
        }
      });
    }

    function pruneCacheByKey(filter?: (key: CacheKey) => boolean) {
      cache.forEach((vnode, key) => {
        if (!filter || !filter(key)) {
          pruneCacheEntry(key);
        }
      });
    }

    function pruneCacheEntry(key: CacheKey) {
      const cached = cache.get(key) as VNode;
      if (!current || cached.type !== current.type) {
        unmount(cached);
      } else if (current) {
        // current active instance should no longer be kept-alive.
        // we can't unmount it now but it might be later, so reset its flag now.
        resetShapeFlag(current);
      }
      cache.delete(key);
      keys.delete(key);
    }

    // 监控 include 和 exclude 响应式属性，当这两个属性发生变化的时候，对缓存的组件进行修剪。
    // 只有组件在 include 中，并不在 exclude 中时，组件才能够被 KeepAlive 缓存。
    // prune cache on include/exclude prop change
    watch(
      () => [props.include, props.exclude],
      ([include, exclude]) => {
        include && pruneCache((name) => matches(include, name));
        exclude && pruneCache((name) => !matches(exclude, name));
      },
      // prune post-render after `current` has been updated
      { flush: 'post', deep: true },
    );

    // cache sub tree after render
    let pendingCacheKey: CacheKey | null = null;

    // 缓存 VNode 的工具函数
    const cacheSubtree = () => {
      // fix #1621, the pendingCacheKey could be 0
      if (pendingCacheKey != null) {
        // 缓存的 VNode 是当前 KeepAlive 组件实例的 subTree 属性
        // KeepAlive 组件的 render 函数返回的 VNode 是子组件的 VNode，
        // 但是在渲染器的视角来看，是谁的 render 函数返回的 VNode，那么这个 VNode 就是属于那个组件实例，所以会将上次渲染的 VNode
        // 设置到当前 KeepAlive 组件实例的 subTree 属性上

        cache.set(pendingCacheKey, getInnerChild(instance.subTree));
      }
    };
    // 在组件挂载和组件升级的时候进行组件的缓存操作
    onMounted(cacheSubtree);
    onUpdated(cacheSubtree);

    onBeforeUnmount(() => {
      cache.forEach((cached) => {
        const { subTree, suspense } = instance;
        const vnode = getInnerChild(subTree);
        if (cached.type === vnode.type) {
          // current instance will be unmounted as part of keep-alive's unmount
          resetShapeFlag(vnode);
          // but invoke its deactivated hook here
          const da = vnode.component!.da;
          da && queuePostRenderEffect(da, suspense);
          return;
        }
        unmount(cached);
      });
    });
    // 返回 KeepAlive 的 render 函数，render 函数的作用是：返回 VNode，VNode 作为参数用于渲染器的渲染
    return () => {
      pendingCacheKey = null;
      // 如果当前的 KeepAlive 组件没有子组件的话，直接 return 即可，不用做任何操作
      if (!slots.default) {
        return null;
      }
      // 通过 slots.default() 获取当前 KeepAlive 的默认子组件信息
      const children = slots.default();
      // 获取第一个子组件
      const rawVNode = children[0];
      // 如果有多个子组件的话，则打印出警告，KeepAlive 只允许有一个子组件，如果有多个的话，则不进行缓存处理
      if (children.length > 1) {
        if (__DEV__) {
          warn(`KeepAlive should contain exactly one component child.`, current);
        }
        current = null;

        // 直接返回子组件的 VNode
        return children;
      } else if (
        !isVNode(rawVNode) ||
        (!(rawVNode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) &&
          !(rawVNode.shapeFlag & ShapeFlags.SUSPENSE))
      ) {
        current = null;
        return rawVNode;
      }
      // 接下来进行缓存的真正处理
      let vnode = getInnerChild(rawVNode);
      const comp = vnode.type as ConcreteComponent;

      // for async components, name check should be based in its loaded
      // inner component if available
      // 获取当前子组件的 name 名称
      const name = getComponentName(
        isAsyncWrapper(vnode) ? (vnode.type as ComponentOptions).__asyncResolved || {} : comp,
      );
      const key = vnode.key == null ? comp : vnode.key;
      const { include, exclude, max } = props;
      // 根据 name、include、exclude 判断当前的子组件是否可以进行缓存
      if (
        (include && (!name || !matches(include, name))) ||
        (exclude && name && matches(exclude, name)) ||
      ) {
        // 当前的子组件不满足缓存要求，直接返回 rawVNode
        current = vnode;
        return rawVNode;
      }
      const cachedVNode = cache.get(key);

      // clone vnode if it's reused because we are going to mutate it
      // 获取当前缓存的 key
      if (vnode.el) {
        vnode = cloneVNode(vnode);
        if (rawVNode.shapeFlag & ShapeFlags.SUSPENSE) {
          rawVNode.ssContent = vnode;
        }
      }

      // 将 key 设置到 pendingCacheKey 变量上
      pendingCacheKey = key;
      // 如果 cachedVNode 存在的话，说明这个组件之前已经被缓存了，此时直接将 cachedVNode 的 el 和 component 赋值到 vnode 上即可
      if (cachedVNode) {
        // copy over mounted state
        vnode.el = cachedVNode.el;
        vnode.component = cachedVNode.component;
        if (vnode.transition) {
          // recursively update transition hooks on subTree
          setTransitionHooks(vnode, vnode.transition);
        }
        // avoid vnode being mounted as fresh

        // 将 vnode 的 shapeFlag 属性设置为 COMPONENT_KEPT_ALIVE，
        // 在渲染器中，如果发现 vnode 的 shapeFlag 属性是 COMPONENT_KEPT_ALIVE 的话，
        // 会使用上面定义的 sharedContext.deactivate 函数进行处理
        vnode.shapeFlag |= ShapeFlags.COMPONENT_KEPT_ALIVE;

        // make this key the freshest
        // 将 key 从 keys 中删除并重新添加 key，key 放在 keys 的最后意味着对应的组件是最新的
        // 当缓存的组件数量超过 max 时，会将缓存的最旧组件移除
        keys.delete(key);

        // 如果 cachedVNode 不存在的话，说明当前的子组件是第一个渲染在 KeepAlive 下面，此时需要进行缓存处理
        // 首先将缓存的 key 保存到 keys 中
        keys.add(key);
      } else {
        keys.add(key);
        // prune oldest entry

        // 如果当前 keys 的个数超过了 max 的话，需要将第一个 key 对应组件缓存移除掉
        if (max && keys.size > parseInt(max as string, 10)) {
          // 使用 pruneCacheEntry 函数将指定 key 对应的组件缓存移除掉
          pruneCacheEntry(keys.values().next().value);
        }
      }
      // avoid vnode being unmounted

      // 将 vnode 的 shapeFlag 标志设置为 COMPONENT_SHOULD_KEEP_ALIVE，这可以避免 vnode 被卸载
      vnode.shapeFlag |= ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE;

      current = vnode;

      // 最终返回用于渲染的 vnode
      return isSuspense(rawVNode.type) ? rawVNode : vnode;
    };
  },
};

if (__COMPAT__) {
  KeepAliveImpl.__isBuildIn = true;
}

// export the public type for h/tsx inference
// also to avoid inline import() in generated d.ts files
export default KeepAliveImpl as any as {
  __isKeepAlive: true;
  new (): {
    $props: VNodeProps & MyKeepAliveProps;
  };
};

function matches(pattern: MatchPattern, name: string): boolean {
  if (isArray(pattern)) {
    return pattern.some((p: string | RegExp) => matches(p, name));
  } else if (isString(pattern)) {
    return pattern.split(',').includes(name);
  } else if (pattern.test) {
    return pattern.test(name);
  }
  /* istanbul ignore next */
  return false;
}

function resetShapeFlag(vnode: VNode) {
  let shapeFlag = vnode.shapeFlag;
  if (shapeFlag & ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE) {
    shapeFlag -= ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE;
  }
  if (shapeFlag & ShapeFlags.COMPONENT_KEPT_ALIVE) {
    shapeFlag -= ShapeFlags.COMPONENT_KEPT_ALIVE;
  }
  vnode.shapeFlag = shapeFlag;
}

function getInnerChild(vnode: VNode) {
  return vnode.shapeFlag & ShapeFlags.SUSPENSE ? vnode.ssContent! : vnode;
}
```

## LRU算法

```js
class LRUCache{
    constructor(capacity){
        this.capacity = capacity || 2
        this.cache = new Map()
    }
    // 存值，超出最大则默认删除第一个：最近最少被用元素
    put(key,val){
        if(this.cache.has(key)){
            this.cache.delete(key)
        }
        if(this.cache.size>=this.capacity){
            this.cache.delete(this.cache.keys().next().value)
        }
        this.cache.set(key,val)
    }
    // 取值，同时刷新缓存新鲜度
    get(key){
        if(this.cache.has(key)){
            const temp = this.cache.get(key)
            this.cache.delete(key)
            this.cache.set(key,temp)
            return temp
        }
        return -1
    }
}
```
