import config from "./config";
import ky from "ky";

export const userService = {
  login,
  logout,
  register,
  setAvatar,
  getUserByID
};

async function getUserByID(id) {
  return ky
    .get(`${config.baseURL}/api/user`, {
      searchParams: {
        id: id
      }
    })
    .json();
}

async function setAvatar(avatar) {
  let post = new FormData();

  post.set("file", avatar);

  return ky
    .post(`${config.baseURL}/api/avatar`, {
      body: post
    })
    .json();
}

async function login(user) {
  return ky
    .post(`${config.baseURL}/api/login`, {
      json: user
    })
    .json();
}
async function register(user) {
  return ky
    .post(`${config.baseURL}/api/register`, {
      json: user
    })
    .json();
}
async function logout() {
  localStorage.removeItem("identity");
}
