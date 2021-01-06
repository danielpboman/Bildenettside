<template>
  <b-overlay :show="loading" class="flex-d images-padding">
    <b-container>
      <waterfall
        :lineGap="300"
        :watch="this.images"
        :minLineGap="40"
        style="pt-5"
      >
        <waterfall-slot
          v-for="item in this.images"
          :width="item.width"
          :height="item.height"
          :key="item.id"
          move-class="item-move"
        >
          <image-component
            :id="item.id"
            :author="item.author"
            :likes="item.likes.length"
          />
        </waterfall-slot>
      </waterfall>
      <infinite-loading spinner="waveDots" @infinite="infiniteHandler">
        <div slot="no-more"></div>
        <div slot="no-results">Ingen bilder :(</div>
      </infinite-loading>
    </b-container>
  </b-overlay>
</template>

<!-- 
v-for="(item, $index) in this.list" :key="$index"
-->
<script>
import { mapState } from "vuex";
import config from "../config";

import { Waterfall, WaterfallSlot } from "vue-waterfall";
import ImageComponent from "./ImageComponent.vue";

export default {
  components: {
    Waterfall,
    WaterfallSlot,
    ImageComponent,
  },
  computed: {
    config: () => config,
    console: () => console,

    ...mapState({
      loading: "image.loadingImages",
    }),
  },
  mounted() {
    this.$store.watch(
      (state) => state.image.new,
      (newImages, oldImages) => {
        this.images = newImages;
      }
    );
  },
  data() {
    return {
      list: [],
      images: [],
      currentPage: 1,
    };
  },
  methods: {
    infiniteHandler($state) {
      this.$store.dispatch("image/getImages", this.currentPage).then(
        (data) => {
          if (data.length && data.length > 0) {
            this.currentPage += 1;
            this.list.push(...data);

            data.forEach((item) => {
              let img = new Image();
              img.onload = () => {
                this.images.push({
                  id: item._id,
                  width: img.width,
                  height: img.height,
                  author: item.author.username,
                  likes: item.likes,
                });
              };
              img.src = config.imagePath(item._id);
            });
            $state.loaded();
          } else {
            $state.complete();
          }
        },
        (error) => {
          console.error(error);
        }
      );
    },
  },
};
</script>

<style>
.images-padding {
  padding-top: 100px;
}

.item-move {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
  -webkit-transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}
</style>
