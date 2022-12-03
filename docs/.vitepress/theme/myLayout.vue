<template>
  <div class="blog-wrap">
    <Layout>
      <template #home-hero-before><slot name="home-hero-before" />
        <loading v-show="commonStore.loading" />
        <layout-main v-show="!commonStore.loading" />
      </template>
      <template #doc-after>
        <Comment v-if="false && (theme.commentConfig?.showComment ?? true) && (frontmatter?.showComment ?? true)" :commentConfig="theme.commentConfig" :key="getKey()" />
      </template>
    </Layout>
  </div>
</template>

<script lang="ts" setup>
import DefaultTheme from 'vitepress/theme'
import useMediumZoom from './hooks/useMediumZoom.js'
import {useData} from "vitepress";
import {useCommonStore} from './store/modules/common'

const { page, theme, frontmatter } = useData()
const getKey = () => {
 return  Date.now().toString(36) + page.relativePath
}
const { Layout } = DefaultTheme
const commonStore = useCommonStore()

useMediumZoom()

</script>

<style scoped>
</style>
