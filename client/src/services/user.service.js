import config from "../config";
import axios from "axios";

export const userService = {
  login,
  logout,
  register,
};

function login(user) {
  return axios({
    method: "post",
    url: `${config.baseURL}/api/login`,
    data: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function logout() {
  localStorage.removeItem("identity");
}

function register(user) {
  return axios({
    method: "post",
    data: JSON.stringify(user),
    url: `${config.baseURL}/api/register`,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
