import { userService } from "../../services";
import router from "../../router";

const state = () => ({
  user: localStorage.getItem("jwt"),
  loggingIn: false,
  registering: false,
});

const actions = {
  login({ commit }, user) {
    commit("setLoggingIn", true);

    commit("setUser", null);

    user = JSON.parse(user);

    userService.login(user).then(
      (login) => {
        commit("setLoggingIn", false);
        commit("setUser", login.data.token);
        router.push("/images")
      },
      (error) => {
        console.error(error);
      }
    );
  },
  logout({ commit }) {
    commit("logout");
  },
  register({ commit }, user) {
    commit("setRegistering", true);

    userService.register(user.username, user.password).then(
      (data) => {
        commit("setRegistering", false);

        console.log(data);
        router.push("/login");
      },
      (error) => {
        console.error(error);
      }
    );
  },
};

const mutations = {
  setLoggingIn(state, loggingIn) {
    state.loggingIn = loggingIn;
  },
  setUser(state, user) {
    state.user = user;
    localStorage.setItem("jwt", user);

    console.log("cookie: ", localStorage.getItem("jwt"));
  },
  setRegistering(state, registering) {
    state.registering = registering;
  },
  logout(state) {
    state.user = null;
    localStorage.removeItem("jwt");
    router.push("/");
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
