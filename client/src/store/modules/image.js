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
        console.log(data.data.docs);
        commit("setImages", data.data.docs);
        commit("loadingImages", false);
      },
      (error) => {
        console.error(error);
        commit("loadingImages", false);
      }
    );
  },
  likeImage({ commit, state }, id) {
    imageService.likeImage(id).then((data) => {
      console.log(data);

      let index = state.images.findIndex((x) => x._id == id);

      if (index !== -1) {
        let likes = state.images[index].likes;

        likes = data.data.likes;
      }
    });
  },
  createImage({ commit }, file) {
    imageService.createImage(file).then(
      (data) => {
        console.log(data);

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
