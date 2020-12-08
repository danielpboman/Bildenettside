import config from "../config";
import axios from "axios";

export const userService = {
  login,
  logout,
  register,
};

function login(user) {
  let form = new FormData();
  form.append("username", user["username"]);
  form.append("password", user["password"]);

  return axios({
    method: "post",
    url: `${config.baseURL}/api/account/login`,
    data: form,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

function logout() {
  localStorage.removeItem("jwt");
}

function register(user) {
  return axios({
    method: "post",
    data: JSON.stringify(user),
    url: `${config.baseURL}/api/account/register`,
  });
}
