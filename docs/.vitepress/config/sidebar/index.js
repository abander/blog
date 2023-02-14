const sidebarConfig = {
    '/summary/': [
        {
            text: '遇到的问题',
            items: [

                { text: 'moment.js 时间格式化-时区问题', link: '/summary/problem/moment.js 时间格式化-时区问题' },
                { text: '文件下载处理', link: '/summary/problem/文件下载处理' },
            ],
        },
        {
            text: '总结',
            items: [
                { text: 'tree的相互转换', link: '/summary/log/tree的相互转换' },
                { text: 'Vue3开发总结-01', link: '/summary/log/Vue3开发总结-01' },
                { text: 'Vue3开发总结-vite-02', link: '/summary/log/Vue3开发总结-vite-02' },
                { text: 'Vue3开发总结-pinia-03', link: '/summary/log/Vue3开发总结-pinia-03' },
            ],
        }
    ],
    '/devops/': [
        {
            text: '持续集成',
            items: [
                { text: '使用 travis 进行持续集成', link: '/devops/travis' },
                { text: 'github webhooks 自动化部署', link: '/devops/webhooks' },
                { text: 'Github Action', link: '/devops/github-action' },
            ],
        },
        {
            text: '环境配置',
            items: [
                { text: 'Mac 常用命令', link: '/devops/mac' },
                { text: 'ssh 免密登陆服务器配置', link: '/devops/ssh' },
                { text: "申请Let's Encrypt免费SSL证书", link: '/devops/certificate' },
                { text: 'charles 抓包环境配置', link: '/devops/charles' },
            ],
        },
        {
            text: 'nginx',
            items: [
                { text: 'nginx 基础', link: '/devops/nginx/basics' },
                { text: 'nginx 代理', link: '/devops/nginx/proxy' },
            ],
        },
        {
            text: 'TCP',
            collapsible: true,
            items: [
                { text: 'tcp报文', link: '/devops/02.tcp报文' },
                { text: 'tcp三次握手', link: '/devops/03.tcp三次握手' },
                { text: 'tcp四次挥手', link: '/devops/04.tcp四次挥手' },
                { text: 'tcp中syn攻击', link: '/devops/05.tcp中syn攻击' },
                { text: 'tcp和udp的区别', link: '/devops/06.tcp和udp的区别' },
            ],
        },
        {
            text: 'HTTP',
            collapsible: true,
            items: [
                { text: 'http报文结构', link: '/devops/07.http报文结构' },
                { text: 'http的请求方法', link: '/devops/08.http的请求方法' },
                { text: 'http状态码', link: '/devops/09.http状态码' },
                { text: 'http请求体和请求头', link: '/devops/10.http请求体和请求头' },
                { text: 'cookie', link: '/devops/11.cookie' },
                { text: 'http优缺点', link: '/devops/12.http优缺点' },
                { text: 'http队头阻塞', link: '/devops/13.http队头阻塞' },
            ],
        },
        {
            text: 'HTTPS',
            collapsible: true,
            items: [
                { text: 'https改进了什么', link: '14.https改进了什么' },
                { text: 'https的tsl连接过程', link: '15.https的tsl连接过程' },
                { text: 'https证书', link: '16.https证书' },
            ],
        },
        {
            text: 'HTTP2',
            collapsible: true,
            items: [
                { text: 'http2新功能', link: '17.http2新功能' },
                { text: 'http2剖析', link: '18.http2剖析' },
                { text: 'http2服务器推送功能', link: '19.http2服务器推送功能' },
                { text: 'http3', link: '20.http3' },
            ],
        },
    ],

    '/javascript/': [
        {
            text: '基础知识',
            items: [
                { text: 'this', link: '/javascript/this' },
                { text: '闭包', link: '/javascript/closure' },
                { text: '原型', link: '/javascript/prototype' },
                { text: '继承', link: '/javascript/extends' },
                { text: 'for of', link: '/javascript/for-of' },
                { text: 'setTimeout', link: '/javascript/setTimeout' },
                { text: 'requestAnimationFrame', link: '/javascript/requestAnimationFrame' },
                { text: '数据类型', link: '/javascript/data-types' },
                { text: 'eval', link: '/javascript/eval' },
                { text: 'proxy', link: '/javascript/proxy' },
            ],
        },
        {
            text: 'v8 - 引擎工作原理',
            items: [
                { text: 'JavaScript 代码的执行流程', link: '/javascript/v8/run-js' },
                { text: '什么是执行上下文栈？', link: '/javascript/v8/context-stack' },
                { text: '什么是作用域？', link: '/javascript/v8/scope' },
                { text: '变量在作用域链上怎么查找？', link: '/javascript/v8/scope-chain' },
                { text: '谈一谈 v8 的垃圾回收机制？', link: '/javascript/v8/gc' },
                { text: 'V8 是如何执行 JavaScript 的？', link: '/javascript/v8/compile' },
                { text: '谈一谈 EventLoop？', link: '/javascript/v8/eventloop' },
            ],
        },
    ],

    '/html/': [
        {
            text: '基础知识',
            items: [
                { text: '前端简介', link: '/css/brief-introduction' },
                { text: 'basic', link: '/html/basic' },
            ],
        },
        {
            text: 'html4',
            items: [],
        },
        {
            text: 'html5',
            items: [],
        }
    ],

    '/css/': [
        {
            text: 'CSS简介',
            items: [
                { text: 'basic', link: '/css/brief-introduction' }
            ],
        },
        {
            text: 'css3',
            items: [
                 { text: '盒模型', link: '/css/css3/box-model' },
                 { text: '浮动', link: '/css/css3/float' }
            ],
        },
        {
            text: 'css4',
            items: [],
        }
    ],

    '/vue2/': [
        {
            text: '组件封装知识点',
            items: [
                { text: 'inheritAttrs', link: '/vue2/component-encapsulation-knowledge/inheritAttrs' }
            ]
        },
        {
            text: '组件封装',
            items: [
                { text: '简单封装示例', link: '/vue2/component-encapsulation/example' },
                { text: '封装button组件', link: '/vue2/component-encapsulation/button' },
                { text: '封装checkbox组件', link: '/vue2/component-encapsulation/checkbox' },
                { text: '封装checkbox-group组件', link: '/vue2/component-encapsulation/checkbox-group' },
                { text: '封装dialog组件', link: '/vue2/component-encapsulation/dialog' },
                { text: '封装form和form-item组件', link: '/vue2/component-encapsulation/form' },
                { text: '封装input组件', link: '/vue2/component-encapsulation/input' },
                { text: '封装radio组件', link: '/vue2/component-encapsulation/radio' },
                { text: '封装radio-group组件', link: '/vue2/component-encapsulation/radio-group' },
                { text: '封装switch组件', link: '/vue2/component-encapsulation/switch' },
                { text: '封装成vue组件库', link: '/vue2/component-encapsulation/component-storehouse' }
            ]
        }
    ],
}

export default sidebarConfig
