import { userService } from "../../services";
import router from "../../router";

const state = () => ({
  user: JSON.parse(localStorage.getItem("user")),
  token: localStorage.getItem("identity"),
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
        commit("setUser", login.data);
        router.replace("/");
      },
      (error) => {
        commit("setLoggingIn", false);
        console.error(error);
      }
    );
  },
  logout({ commit }) {
    commit("logout");
  },
  register({ commit }, user) {
    commit("setRegistering", true);

    user = JSON.parse(user);
    userService.register(user).then(
      (data) => {
        commit("setRegistering", false);
        console.debug(data);

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
  setUser(state, login) {
    if (!login) {
      state.token = null;
      state.user = null;
      localStorage.removeItem("user");
      localStorage.removeItem("identity");
      return;
    }
    const { token, id, username, scope } = login;
    state.token = token;
    state.user = {
      id: id,
      username: username,
      scope: scope,
    };
    localStorage.setItem("user", JSON.stringify(state.user));
    localStorage.setItem("identity", token);
  },
  setRegistering(state, registering) {
    state.registering = registering;
  },
  logout(state) {
    state.user = null;
    state.token = null;
    localStorage.removeItem("identity");
    router.push("/");
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
