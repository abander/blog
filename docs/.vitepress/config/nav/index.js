const navConfig =  [
    { text: '首页', link: '/'},
    { text: '笔记', link: '/note/' ,activeMatch: '/note/'},
    {
        text: '日常',
        items: [
            { text: 'html', link: '/daily/html/', activeMatch: '/daily/html/' },
            { text: 'css', link: '/daily/css/', activeMatch: '/daily/css' },
            { text: 'js', link: '/daily/js/', activeMatch: '/daily/js/' },
            { text: 'vue2', link: '/daily/vue2/', activeMatch: '/daily/vue2/' },
            { text: 'vue3', link: '/daily/vue3/', activeMatch: '/daily/vue3/' },
            { text: '组件封装', link: '/daily/component-encapsulation/', activeMatch: '/daily/component-encapsulation/' },
        ],
        activeMatch: '/daily/'
    },
    {text: '问题总结', link: '/issue-summary/', activeMatch: '/issue-summary/'},
    {text: '杂项', link: '/miscellaneous/', activeMatch: '/miscellaneous/'},
    {
        text: 'zzh笔记',
        items: [
            { text: '总结', link: '/zzh/summary/', activeMatch: '/zzh/summary/' },
            { text: '日常', link: '/zzh/daily/', activeMatch: '/zzh/daily/' }
        ],
        activeMatch: '/zzh/'
    },
    {text: '分类', link: '/tags', activeMatch: '/tags'},
    { text: 'Javascript', link: '/javascript/' ,activeMatch: '/javascript/'},
    { text: '杂项2', link: '/devops/' ,activeMatch: '/devops/'},
]


export default navConfig
