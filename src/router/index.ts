import { createRouter, createWebHashHistory } from 'vue-router'

import DefaultLayout from '@/layouts/DefaultLayout.vue'
import Dashboard from '@/pages/Dashboard.vue'
import Bikes from '@/pages/Bikes.vue'
import Kit from '@/pages/Kit.vue'

const routes = [
    {
        path: '/',
        component: DefaultLayout,
        children: [
            { path: '', component: Dashboard },
            { path: 'kit', component: Kit },
            { path: 'bikes', component: Bikes },
        ]
    }
]

const router = createRouter({
    history: createWebHashHistory(), // <-- HASH MODE
    routes
})

export default router
