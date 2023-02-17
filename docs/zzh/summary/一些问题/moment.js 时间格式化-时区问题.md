---
title: moment.js 时间格式化-时区问题
date: 2022-11-1 10:12:01
sidebar: auto
author: Zzh
tags:
  - moment.js
  - Bug
categories:
  - 总结
description: moment.format时间转换，时区不同出现时差
---
# moment.js 时间格式化-时区问题

## 问题

使用moment.format进行时间格式化时出现时差



```javascript
// 通过函数format(格式化的字符串模板)对时间格式化 （UTC格式）
const tiem = '2022-11-14T21:18:24.000Z'

// 进行转换 
moment(date).format('YYYY-MM-DD HH:mm:ss') 
// 2022-11-15 05:18:24
```



## 分析

时间格式不同，需要转换为北京时间



## 解决

### UTC转北京时间

目标是UTC时间，moment(utcTime).utc().format()

```javascript

moment(utcTime).utc().format('YYYY-MM-DD HH:mm:ss')

```

### 北京时间转UTC

moment(utcTime).utcOffset(8).format

```javascript
moment(utcTime).utcOffset(8).format('YYYY-MM-DD HH:mm:ss')

//utcOffset 通过分钟/小时/字符串设置偏移量，如果输入小于16和大于-16，会将输入解释为小时。
```



## 补充

关于format转化是24小时制还是12小时制

```javascript
// 24小时
moment(time).format('YYYY-MM-DD HH:mm:ss')
//12小时
moment(time).format('YYYY-MM-DD hh:mm:ss')
```



