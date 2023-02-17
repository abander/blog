---
title: Vue3开发总结-vite-02
date: 2022-12-01 17:37:11
sidebar: auto
author: Zzh
tags:
  - Vue3
categories:
  - 总结
description: vite使用总结
---

# Vue3开发总结-vite-02
::: tip 前言
vite使用相关总结
:::

## 函数和组件库的自动按需导入

::: warning 相关插件
自动导入unplugin-auto-import
按需引入unplugin-vue-components
:::
### 安装
```
pnpm i unplugin-auto-import unplugin-vue-components  -D
```
### 使用
```javascript
// plugin
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import VueSetupExtend from 'vite-plugin-vue-setup-extend';
import viteCompression from 'vite-plugin-compression';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import IconsResolver from 'unplugin-icons/resolver';
import Icons from 'unplugin-icons/vite';

export const createVitePlugins = (env) => {
    const plugins = [
        vue(),
        VueSetupExtend(),
        viteCompression({
            verbose: true,
            disable: false,
            threshold: 10240,
            algorithm: 'gzip',
            ext: '.gz',
        }),
        Components({
            resolvers: [ElementPlusResolver(), IconsResolver({ enabledCollections: ['ep'] })],
        }),
        AutoImport({
            resolver: [ElementPlusResolver(), IconsResolver({ prefix: 'Icon' })],
            imports: ['vue', 'vue-router', 'pinia'],
            // 指定引入根目录下的 requests，config，utils 目录内的所有函数
            dirs: ['./src/requests/**', './src/config/**', './src/utils/**'],
            // 指定生成的 d.ts 文件位置与文件名
            dts: './src/auto-imports.d.ts',
            // 配置开启 eslint
            eslintrc: {
                enabled: true,
            },
        }),
        Icons({ autoInstall: true }),
    ];
    return plugins;
}
...
```

## vite动态导入
在webpack中是require.context动态导入文件
### import.meta.glob
在 vite 中，提供了 Glob 导入功能，可以从文件系统导入多个模块。
::: danger 提示
该方法匹配到的文件默认是懒加载，**动态导入**，构建时会分离独立的 chunk，是异步导入，返回的是 Promise，需要做异步操作
:::

```javascript
// 获取各模块的路由
const modules = import.meta.globEager('./modules/*.js');
const asyncRoutes = [];
Object.keys(modules).forEach(key => {
    asyncRoutes.push(...modules[key].default);
});
```
### import.meta.globEager
该方法是直接导入所有模块，并且是同步导入

### new Url 
在webpack使用的是require动态导入图片，在vite里使用
`new Url `
`import.meta.globEager`

```javascript
/*
  url-完整的 URL，或者仅相对路径（如果设置了 base）
 [base]-base —— 可选的 base URL：如果设置了此参数，且参数 url 只有路径，则会根据这个 base 生成 URL。
 */

 new Url(url, [base])
```

```javascript
function getIcon(name) {
  return new URL(`../../../assets/images/cropBg${name}.png`, import.meta.url).href;
}

/**
 * 创建一个新的url对象

 */
```

#### import.meta
import.meta 对象包含关于当前模块的信息。
它的内容取决于其所在的环境。在浏览器环境中，它包含当前脚本的 URL，或者如果它是在 HTML 中的话，则包含当前页面的 URL。
比如在组件中
<a-image src="https://cdn.jsdelivr.net/gh/zhihao2030/note-img@main/20221201172943.png" />


## 配置全局 scss
```javascript
    css: {
      preprocessorOptions: {
        // 全局引入了 scss 的文件
        scss: {
          additionalData: `
          @import "@/styles/variables.scss";
          @import "@/styles/Mixins.scss";
        `,
          avascriptEnabled: true,
        },
      },
    },
```

## 完整配置
```javascript
import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';
import { createVitePlugins } from './build/plugin';

export default defineConfig((env) => {
  const viteEnv = loadEnv(env.mode, process.cwd());
  return {
    base: viteEnv.VITE_BASE,
    plugins: createVitePlugins(env),
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'), // 把 @ 指向到 src 目录去
      },
      extensions: ['.js', '.vue'],
    },
    server: {
      host: true, // host设置为true才可以使用network的形式，以ip访问项目
      port: 8000, // 端口号
      open: true, // 自动打开浏览器
      cors: true, // 跨域设置允许
      strictPort: false, // 如果端口已占用直接退出
      // 接口代理
      proxy: {
        '/bd-profile/': {
          // 本地 8000 前端代码的接口 代理到 8888 的服务端口
          target: 'http://xxxx:8090/',
          changeOrigin: true, // 允许跨域
          // rewrite: (path) => path.replace('/api/', '/'),
        },
      },
    },
    build: {
      reportCompressedSize: false,
      // 消除打包大小超过500kb警告
      chunkSizeWarningLimit: 2000,
      minify: 'esbuild',
      assetsDir: 'static/assets',
      outDir: env.mode === 'production' ? 'pack/profile' : 'pack/profile_test',
      // 静态资源打包到dist下的不同目录
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
        },
      },
    },
    css: {
      preprocessorOptions: {
        // 全局引入了 scss 的文件
        scss: {
          additionalData: `
          @import "@/styles/variables.scss";
          @import "@/styles/Mixins.scss";
        `,
          avascriptEnabled: true,
        },
      },
    },
  };
});

```



