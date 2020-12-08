import Vue from "vue";
import Vuex from "vuex";
import { createLogger } from "vuex";

import user from "./modules/user.js";
import image from "./modules/image.js";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user,
    image,
  },
  plugins: [createLogger()],
});
