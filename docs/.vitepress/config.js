import { defineConfig } from 'vitepress';
import markdownConfig from './config/markdown'
import headConfig from "./config/head";
import navConfig from './config/nav'
import sidebarConfig from './config/sidebar'
import selfPlugin from './config/selfPlugin'


// @ts-ignore
export default defineConfig({
  title: "smq",
  description: '~',
  lastUpdated: true,
  base: '/',
  lang: 'zh-CN',
  outDir: './.vitepress/smq',
  //cleanUrls: 'without-subfolders',
  head: headConfig,
  markdown: markdownConfig,
  themeConfig: {
    siteTitle: `qiAn's Log`,
    outlineTitle: '目录', // 右侧边栏的大纲标题文本配置
    lastUpdatedText: '最后更新', // 最后更新时间文本配置, 需先配置lastUpdated为true
    // @ts-ignore
    outline: 'deep',
    algolia: {
      appId: 'JMAHU2S9EA',
      apiKey: '1adca3cee698d4666229630690f3b686',
      indexName: 'blog',
      searchParameters: {
        facetFilters: ['tags:v2'],
      },
    },
    authorInfo: {
      author: 'qiAn'
    },
    commentConfig: {
      showComment: true
    },
    // 文档页脚文本配置
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },
    nav:navConfig,
    sidebar: sidebarConfig,
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2019-present qiAn',
    },
    selfPlugin
  },
});
