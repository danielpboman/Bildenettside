import { authHeader } from "../helpers";
import config from "../config";
import axios from "axios";

export const imageService = {
  createImage,
  likeImage,
  findImageById,
  getImages,
  getLikesForImage,
};

function getImages() {
  return axios({
    method: "get",
    url: `${config.baseURL}/api/images`,
  }).then(handleResponse);

  //return axios.get(`${config.baseURL}/api/images`, {}).then(handleResponse);
}

function getLikesForImage(id) {
  return axios({
    method: "get",
    url: `${config.baseURL}/api/image/likes?id=${id}`,
  }).then(handleResponse);
}

function likeImage(id) {
  return axios({
    method: "post",
    headers: authHeader(),
    url: `${config.baseURL}/api/auth/like?id=${id}`,
  });
}

function findImageById(id) {
  return axios({
    method: "get",
    url: `${config.baseURL}/api/image?id=${id}`,
  });
}

function createImage(files) {
  let post = new FormData();

  for (let file of files) {
    console.log(file);

    if (file && file instanceof File) {
      post.append("file[]", file);
    }
  }

  return axios({
    method: "post",
    data: post,
    headers: {
      "Content-Type": "multipart/form-data",
      ...authHeader(),
    },
  })
    .then(handleResponse)
    .then((id) => console.log("got id: " + id));
}

function handleResponse(response) {
  return response;
}
