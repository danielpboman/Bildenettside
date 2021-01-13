import {
  LOADING_IMAGES,
  UPDATE_IMAGE,
  ADD_IMAGES,
  SET_IMAGES
} from "./mutation-types";

export default {
  CLEAR_IMAGES(state) {
    state.images = [];
  },
  [LOADING_IMAGES](state, loading) {
    state.loadingImages = loading;
  },
  [SET_IMAGES](state, images) {
    state.images = images;
  },
  [ADD_IMAGES](state, images) {
    let newImages = state.images.slice();

    images.forEach(img => {
      if (state.images.findIndex(i => i._id === img._id) === -1) {
        newImages.push(img);
      }
    });

    state.images = newImages;
  },
  [UPDATE_IMAGE](state, image) {
    let index = state.images.findIndex(x => x._id === image._id);
    console.log(index);

    if (~index) {
      state.images = [
        ...state.images.slice(0, index),
        image,
        ...state.images.slice(index + 1)
      ];
    } else {
      console.log(state.images);
      state.images.unshift(image);
      console.log(state.images);
    }
  }
};
