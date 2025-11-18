import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "smartmenu",
      component: () => import("../views/mainpage/index.vue"),
    },
    {
      path: "/foodlibrary",
      name: "foodlibrary",
      component: () => import("../views/foodlibrary/index.vue"),
    },
    {
      path: "/weeklymenu",
      name: "weeklymenu",
      component: () => import("../views/weeklymenu/index.vue"),
    },
  ],
});

export default router;
