import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "main-page",
    component: () => import("../views/MainPage/MainPage"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/Login/Login"),
  },
  {
    path : "/password-recovery",
    name : "password-recovery",
    component : () => import("../views/Login/RecoveryPassword")
  },
  {
    path: "/service",
    name: "service",
    component: () => import("../views/Services/Services"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
