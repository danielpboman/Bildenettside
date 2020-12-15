<template>
  <b-overlay :show="loading" class="d-flex images-padding">
    <b-container class="overflow-auto">
      <b-pagination
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        class="justify-content-center"
      >
      </b-pagination>

      <b-list-group
        v-for="img in getImagesForPage()"
        :key="img._id"
        class="d-flex justify-content-center"
      >
        <b-list-group-item>
          <image-component :image="img"></image-component>
        </b-list-group-item>
      </b-list-group>
    </b-container>
  </b-overlay>
</template>

<script>
import { mapState } from "vuex";
import config from "../config";
import ImageComponent from "./ImageComponent.vue";
export default {
  components: { ImageComponent },
  computed: {
    config: () => config,
    console: () => console,
    rows() {
      return this.images.length;
    },
    ...mapState({
      loading: "image.loadingImages",
    }),
  },
  mounted() {
    this.$store.watch(
      (state) => state.image.images,
      (newImages, oldImages) => {
        this.images = newImages;
      }
    );
  },
  data() {
    return {
      images: [],
      currentPage: 1,
      perPage: 5,
      pages: 0,
    };
  },
  created() {
    this.$store.dispatch("image/getImages");
  },
  methods: {
    getImagesForPage() {
      return this.images.slice(
        (this.currentPage - 1) * this.perPage,
        this.currentPage * this.perPage
      );
    },
  },
};
</script>

<style>
.images-padding {
  padding-top: 100px;
}
</style>
