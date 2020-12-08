<template>
  <b-overlay :show="image.loadingImages">
    <b-container class="overflow-auto">
      <b-pagination
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
      >
      </b-pagination>

      <b-list-group v-for="img in getImagesForPage()" :key="img.id">
        <b-list-group-item>
          <b-img-lazy
            :src="config.imagePath(img.id)"
            style="max-width: 100%;"
          />
        </b-list-group-item>
      </b-list-group>
    </b-container>
  </b-overlay>
</template>

<script>
import { mapState } from "vuex";
import config from "../config";
export default {
  computed: {
    ...mapState(["image"]),
    config: () => config,
    console: () => console,
    rows: () => this.images.length,
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

<style></style>
