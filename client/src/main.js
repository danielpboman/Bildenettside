import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueRouter from "vue-router";
import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

import InfiniteLoading from "vue-infinite-loading";

Vue.config.productionTip = false;
Vue.use(VueRouter);

Vue.use(InfiniteLoading);
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
