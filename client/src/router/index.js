import VueRouter from "vue-router";

/*
import ImagesComponent from "../components/ImagesComponent.vue";
import LoginComponent from "../components/LoginComponent.vue";
import RegisterComponent from "../components/RegisterComponent.vue";
*/

import Layout from "../views/layout";
const routes = [
  /*
  { path: "/images", component: ImagesComponent },
  { path: "/login", component: LoginComponent },
  { path: "/register", component: RegisterComponent },
*/

  { path: "/", component: Layout },
  { path: "*", redirect: "/" },
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
