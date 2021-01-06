import { imageService } from "../../services";
import router from "../../router";

const state = () => ({
  images: [],
  loadingImages: true,
});

const getters = {
  likedImages(state, getters) {
    return state.images.reduce((filtered, image) => {
      let likes = image.likes.filter((id) => {
        console.log(id, getters.user.id);
        return id === getters.user.id;
      });

      console.log(filtered, image, likes);

      return filtered;
    }, []);
  },
  user(state, getters, rootState, rootGetters) {
    return rootState.user.user;
  },
};

const actions = {
  getImageById({ commit }, id) {
    commit("loadingImages", true);

    imageService.findImageById(id).then(
      (data) => {
        commit("updateImage", data);
        commit("loadingImages", false);
      },
      (error) => {
        commit("loadingImages", false);

        console.error(error);
      }
    );
  },
  getImages({ commit }, page, limit = 50) {
    commit("loadingImages", true);

    return new Promise((resolve, reject) => {
      imageService.getImages(page, limit).then(
        (data) => {
          commit("loadingImages", false);
          commit("addImages", data.data.docs);

          resolve(data.data.docs);
        },
        (error) => {
          console.error(error);
          commit("loadingImages", false);
          reject(error);
        }
      );
    });
  },
  dislikeImage({ commit, state }, id) {
    imageService.dislikeImage(id).then(
      (data) => {
        commit("updateImage", data.data);
      },
      (error) => console.error(error)
    );
  },
  likeImage({ commit, state }, id) {
    imageService.likeImage(id).then(
      (data) => {
        commit("updateImage", data.data);
      },
      (error) => console.error(error)
    );
  },
  createImage({ commit }, file) {
    imageService.createImage(file).then(
      (data) => {
        router.push("/images");
      },
      (error) => {
        console.error(error);
      }
    );
  },
};

const mutations = {
  loadingImages(state, loading) {
    state.loadingImages = loading;
  },
  setImages(state, images) {
    state.images = images;
  },
  addImages(state, images) {
    state.images.push(...images);
  },
  updateImage(state, image) {
    console.log("updateImage: ", image);
    let index = state.images.findIndex((x) => x._id == image._id);
    if (index !== -1) {
      state.images[index] = image;
    }
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
