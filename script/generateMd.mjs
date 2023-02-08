import fs from 'node:fs/promises'
import moment from 'moment'
moment.locale('zh-cn')

console.log('start markdown')
const str = `---
title: -
date: ${moment().format('YYYY-MM-DD HH:mm:ss')}
sidebar: auto
author: qiAn
tags:
  - tag1
categories:
  - categories
description: -
---

# 文章标题
`

await fs.writeFile('../template.md',str)
console.log('end')
