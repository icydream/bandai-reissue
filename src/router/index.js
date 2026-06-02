import { createWebHashHistory, createRouter } from "vue-router";

const router = createRouter({
    history: createWebHashHistory(`${import.meta.env.VITE_CONTEXT_PATH}/`),
    routes: [
        {
            path: '/',
            name: 'index',
            component: () => import('@/pages/ReissueIndex.vue'),
            children: [
                {
                    path: 'schedule/:period',
                    name: 'schedule',
                    component: () => import('@/pages/ReissueSchedule.vue')
                }
            ]
        }
    ]
});

export default router;