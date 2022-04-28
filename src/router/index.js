import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "main-page",
    component: () => import("../views/MainPage/MainPage"),
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/Login/Login"),
    meta: { notRequiresAuth: true },
  },
  {
    path: "/password-recovery",
    name: "password-recovery",
    component: () => import("../views/Login/RecoveryPassword"),
    meta: { notRequiresAuth: true },

  },
  {
    path: "/service",
    name: "service",
    component: () => import("../views/Services/Services"),
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: "/statistics",
    name: "statistics",
    component: () => import("../views/Statistics/Statistics"),
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: "/test",
    name: "test",
    component: () => import("../views/Test"),
    meta: {
      requiresAuth: true,
    }
  },

  {
    path: "*",
    name : "404",
    component: () => import("../components/PageNotFound"),
    meta: { notRequiresAuth: true },
  },

];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});
router.beforeEach((to, from, next) => {
  const currentUser = window.localStorage.getItem("token");
  const requieAuth = to.matched.some((todo) => todo.meta.requiresAuth);
  const notRequieAuth = to.matched.some((todo) => todo.meta.notRequiresAuth);

  if (notRequieAuth && currentUser) {
    next("/");
  }

  if (requieAuth && !currentUser) {

    next("/login");
  } else {

    next();
  }
});

export default router;
