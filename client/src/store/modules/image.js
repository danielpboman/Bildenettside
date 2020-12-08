import { imageService } from "../../services";
import router from "../../router";

const state = () => ({
  images: [],
  loadingImages: true,
});

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
  getImages({ commit }) {
    commit("loadingImages", true);

    imageService.getImages().then(
      (data) => {
        commit("setImages", data.data);
        commit("loadingImages", false);
      },
      (error) => {
        commit("loadingImages", false);

        console.error(error);
      }
    );
  },
  createImage({ commit }, file) {
    imageService.createImage(file).then(
      (data) => {
        console.log(data.data);

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
  updateImage(state, image) {
    state.imageInfo[image.data.ID] = image.data;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
