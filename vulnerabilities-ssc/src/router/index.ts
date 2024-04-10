import {createRouter, createWebHistory} from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component:()=>import('../views/home.vue')
        },
        {
            path: '/home',
            redirect: '/'
        },
        {
            path: '/packages',
            component: ()=>import('../views/packages.vue')
        },
        {
            path: '/graph',
            component: ()=>import('../components/SSC-d3.vue')
        },
        {
            path: '/vulnerabilities',
            component: ()=>import('../views/vulnerabilities.vue')
        },
        {
            path: '/cwe',
            component: ()=>import('../views/cwe.vue')
        },
        {
            path: '/cot',
            component: ()=>import('../views/cot.vue')
        },
        {
            path: '/about',
            component: ()=>import('../views/about.vue')
        }
    ]
})

export default router