import {createRouter, createWebHistory} from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component:()=>import('../views/vulnerabilities.vue')
        },
        {
            path: '/vulnerabilities',
            redirect: '/'
        },
        {
            path: '/packages',
            component: ()=>import('../views/packages.vue')
        },
        {
            path: '/graph',
            component: ()=>import('../components/SSC-d3.vue')
        }
    ]
})

export default router