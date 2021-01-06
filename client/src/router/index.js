import VueRouter from "vue-router";

import ImagesComponent from "../components/ImagesComponent.vue";
import LoginComponent from "../components/LoginComponent.vue";
import RegisterComponent from "../components/RegisterComponent.vue";

const routes = [
  { path: "/images", component: ImagesComponent },
  { path: "/login", component: LoginComponent },
  { path: "/register", component: RegisterComponent },

  { path: "*", redirect: "/images" },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  const publicPages = ["/image", "/images", "/register", "/login"];
  const authReq = !publicPages.includes(to.path);

  const loggedIn = localStorage.getItem("identity");

  if (authReq && !loggedIn) {
    return next("/login");
  }

  next();
});

export default router;
