import { authHeader } from "./helpers.js";
import config from "./config";

import ky from "ky";

export const imageService = {
  createImage,
  getImages,
  likeImage,
  dislikeImage,
  findImageById,
  getLikesForImage
};

async function getImages(page, limit = 50) {
  return ky
    .get(`${config.baseURL}/api/images`, {
      searchParams: {
        limit: limit,
        page: page
      }
    })
    .json();
}

async function getLikesForImage(id) {
  return ky.get(`${config.baseURL}/api/likes`, {
    searchParams: {
      id: id
    }
  });
}

async function dislikeImage(id) {
  return ky
    .delete(`${config.baseURL}/api/like`, {
      searchParams: {
        id: id
      },
      headers: authHeader()
    })
    .json();
}

async function likeImage(id) {
  return ky
    .post(`${config.baseURL}/api/like`, {
      searchParams: {
        id: id
      },
      headers: authHeader()
    })
    .json();
}

async function findImageById(id) {
  return ky.get(`${config.baseURL}/api/image`, {
    searchParams: {
      id: id
    }
  });
}

async function createImage(file) {
  let post = new FormData();

  post.set("file", file);

  return ky.post(`${config.baseURL}/api/upload`, {
    headers: { ...authHeader() },
    body: post
  });
}
