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
  });

  //return axios.get(`${config.baseURL}/api/images`, {}).then(handleResponse);
}

function getLikesForImage(id) {
  return axios({
    method: "get",
    url: `${config.baseURL}/api/image/likes?id=${id}`,
  });
}

function likeImage(id) {
  return axios({
    method: "post",
    headers: authHeader(),
    url: `${config.baseURL}/api/like/${id}`,
  });
}

function findImageById(id) {
  return axios({
    method: "get",
    url: `${config.baseURL}/api/image/${id}`,
  });
}

function createImage(files) {
  let post = new FormData();

  post.set("file", files);

  let headers = {
    "Content-Type": "multipart/form-data",
    ...authHeader(),
  };

  return axios({
    method: "post",
    url: `${config.baseURL}/api/upload`,
    data: post,
    headers: headers,
  }).then((id) => console.log(id));
}

function handleResponse(response) {
  return response;
}
