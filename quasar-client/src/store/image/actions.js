import { Router } from "../../router";
import { imageService } from "../../services";

import { ADD_IMAGES, UPDATE_IMAGE, LOADING_IMAGES } from "./mutation-types.js";

export default {
  getImageByID(context, id) {
    context.commit(LOADING_IMAGES, true);

    imageService.findImageById(id).then(
      data => {
        context.commit(UPDATE_IMAGE, data.data);
        context.commit(LOADING_IMAGES, false);
      },
      error => {
        console.error(error);
      }
    );
  },
  getImages(context, page, limit = 10) {
    context.commit(LOADING_IMAGES, true);

    return new Promise((resolve, reject) => {
      imageService.getImages(page, limit).then(
        data => {
          context.commit(ADD_IMAGES, data.docs);
          resolve(data.docs);
        },
        error => {
          console.error(error);
          context.commit(LOADING_IMAGES, false);

          reject(error);
        }
      );
    });
  },
  likeImage(context, id) {
    return new Promise((resolve, reject) => {
      imageService.likeImage(id).then(
        data => {
          context.commit(UPDATE_IMAGE, data);
          resolve(data);
        },
        error => {
          console.error(error);
          reject(error);
        }
      );
    });
  },

  dislikeImage(context, id) {
    return new Promise((resolve, reject) => {
      imageService.dislikeImage(id).then(
        data => {
          context.commit(UPDATE_IMAGE, data);
          resolve(data);
        },
        error => {
          console.error(error);
          reject(error);
        }
      );
    });
  },

  createImage(context, file) {
    return new Promise((resolve, reject) => {
      imageService.createImage(file).then(
        data => {
          console.log("createImage data: ", data);
          context.commit(UPDATE_IMAGE, data);
          resolve(data);
        },
        error => {
          console.error(error);
          reject(error);
        }
      );
    });
  }
};
