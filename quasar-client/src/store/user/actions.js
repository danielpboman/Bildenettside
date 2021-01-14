import { Router } from "../../router";
import { userService } from "../../services";
import { LOGOUT, SET_LOGGING_IN, SET_USER } from "./mutation-types";

export default {
  setAvatar(context, avatar) {
    userService.setAvatar(avatar).then(
      data => {
        console.log("avatar", data);
      },
      error => {
        console.error(error);
      }
    );
  },
  login(context, user) {
    context.commit(SET_LOGGING_IN, true);
    context.commit(SET_USER, null);

    return new Promise((resolve, reject) => {
      userService.login(user).then(
        login => {
          context.commit(SET_LOGGING_IN, false);
          context.commit(SET_USER, login);
          Router.replace("/");
          resolve(login);
        },
        error => {
          context.commit(SET_LOGGING_IN, false);

          console.error(error);
          reject(error);
        }
      );
    });
  },
  register(context, user) {
    context.commit(SET_LOGGING_IN, true);

    return new Promise((resolve, reject) => {
      userService.register(user).then(
        data => {
          context.commit(SET_LOGGING_IN, false);

          Router.push("/login");
          resolve(data.data);
        },
        error => {
          console.error(error);
          reject(error);
        }
      );
    });
  },
  logout(context) {
    context.commit(LOGOUT);
  }
};
