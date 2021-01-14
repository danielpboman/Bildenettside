<template>
  <div class="q-pa-md">
    <q-infinite-scroll
      class="fit row wrap justify-center items-start content-start q-gutter-lg"
      @load="onLoad"
      :offset="250"
    >
      <image-component
        v-for="(img, index) in images"
        :key="index"
        :imageID="img._id"
        :fileName="img.fileName"
      />
    </q-infinite-scroll>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ImageComponent from "../components/Image";
export default {
  name: "images",
  components: {
    ImageComponent
  },
  computed: {
    config: () => config,
    ...mapState({
      images: state => state.image.images
    })
  },

  created() {
    this.$store.commit("image/CLEAR_IMAGES");
  },

  methods: {
    async onLoad(index, done) {
      try {
        let images = await this.$store.dispatch("image/getImages", index);

        if (images.length && images.length > 0) {
          done();
        }
      } catch (error) {
        console.log(error);
        done(true);
      }
    }
  }
};
</script>

<style></style>
