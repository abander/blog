---
title: tree的相互转换
date: 2022-11-3 20:32:09
sidebar: auto
author: Zzh
tags:
  - 方法总结
categories:
  - 总结
description: 在开发过程中，使用TreeSelect遇到平铺的树形结构，需要转化为树形结构，所以对list与树形结构方法进行总结
---
# tree与平铺list的相互转换

::: tip 前言
在开发过程中，使用TreeSelect遇到平铺的树形结构，需要转化为树形结构，所以对list与树形结构方法进行总结
:::




## 返回的平铺数组

```javascript
const array = [
  { id: '1', name: '节点1' },
  { id: '2', pid: '1', name: '节点1-1' },
  { id: '3', pid: '1', name: '节点1-2' },
  { id: '4',  pid: '2', name: '节点2-1' },
  { id: '5',  pid: '2', name: '节点2-2' },
  { id: '6',  pid: '5', name: '节点2-2' },
]
```



## 实现list转tree

### 第一种方法：递归 - 1

```javascript
/**
 *
 * @param {Array}  list
 * @param {String} idName
 * @param {String} parentIdName
 * @param {String} childrenName 
 * @returns {*[]}
 */
function generateTree(list,{idName='id',parentIdName='pid',childrenName='children'}={}) {
    const tree = []
    for (const node of list) {
        // 无pid代表根节点
        if (!node[parentIdName]) {
            let temp = {...node}
            temp[childrenName] = findChildNode(temp[idName],list)
            tree.push(temp)
        }
    }
    function findChildNode(id,list) {
        let children = []
        for (const child of list) {
            id === child[parentIdName] && children.push(child)
        }

        for (const child of children) {
            const temp = findChildNode(child[idName],list)
            if (temp.length) {
                child[childrenName] = temp
            }
        }
        return children
    }

    return tree
}
```





### 第二种方法：map

```javascript
function generateTree(list,{idName='id',parentIdName='pid',childrenName='children'}={}) {
    const map = {} // 以数组元素id为key 进行映射
    const result = [] // 结果

    for(let i = 0; i < list.length; i++) {
        
        map[list[i][idName]] = i
    }

    for(let i = 0; i < list.length; i++) {
        const node = list[i]
        // 判断当前节点是否有父节点 - list[map[node[parentIdName]]]
        if (node[parentIdName] && list[map[node[parentIdName]]]) {
            if (!list[map[node[parentIdName]]].children) {
                list[map[node[parentIdName]]].children = []
            }
            list[map[node[parentIdName]]].children.push(node)
        } else {
            result.push(node)
        }
    }

    return result
}
```



### 结果

```json
[
    {
        "id": "1",
        "name": "节点1",
        "children": [
            {
                "id": "2",
                "pid": "1",
                "name": "节点1-1",
                "children": [
                    {
                        "id": "4",
                        "pid": "2",
                        "name": "节点2-1"
                    },
                    {
                        "id": "5",
                        "pid": "2",
                        "name": "节点2-2"
                    }
                ]
            },
            {
                "id": "3",
                "pid": "1",
                "name": "节点1-2"
            }
        ]
    }
]
```

