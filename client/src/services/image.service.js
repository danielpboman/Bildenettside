import { authHeader } from "../helpers";
import config from "../config";
import axios from "axios";

export const imageService = {
  createImage,
  likeImage,
  dislikeImage,
  findImageById,
  getImages,
  getLikesForImage,
};

function getImages(page, limit = 50) {
  return axios({
    method: "get",
    url: `${config.baseURL}/api/images`,
    params: {
      page: page,
      limit: limit,
    },
  });
}

function getLikesForImage(id) {
  return axios({
    method: "get",
    url: `${config.baseURL}/api/image/likes?id=${id}`,
  });
}

function dislikeImage(id) {
  return axios({
    method: "delete",
    headers: authHeader(),
    url: `${config.baseURL}/api/like/${id}`,
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
