import {
  LOGOUT,
  SET_LOGGING_IN,
  SET_USER,
  SET_AVATAR,
  ADD_USER
} from "./mutation-types";

export default {
  [ADD_USER](state, user) {
    state.users.push(user);
  },

  [SET_LOGGING_IN](state, loggingIn) {
    state.loggingIn = loggingIn;
  },
  [SET_USER](state, login) {
    if (!login) {
      state.token = null;
      state.user = null;
      localStorage.removeItem("user");
      localStorage.removeItem("identity");
      return;
    }
    console.log(login);
    const { token, id, username, scope } = login;
    state.token = token;
    state.user = {
      id: id,
      username: username,
      scope: scope
    };
    localStorage.setItem("user", JSON.stringify(state.user));
    localStorage.setItem("identity", token);
  },

  [LOGOUT](state) {
    state.user = null;
    state.token = null;
    localStorage.removeItem("identity");
    router.push("/");
  }
};
