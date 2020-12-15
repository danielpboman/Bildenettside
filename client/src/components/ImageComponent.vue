<template>
  <b-container class="d-flex" style="width:500px;">
    <b-container style="display:block;">
      <b-col>
        <b-container>
          <b-button variant="outline-dark" @click="likeImage()">
            <b-icon :icon="likedByUser() ? 'heart-fill' : 'heart'"> </b-icon>
            {{ this.likeCount() }}
          </b-button>

          <b-container>
            <p class="text-justify">
              {{ "Lastet opp av " + this.image.author.username }}
            </p>
          </b-container>
        </b-container>
      </b-col>
      <!-- -->
      <b-col>
        <b-img-lazy
          :src="config.imagePath(this.$props.image._id)"
          style="max-width: 500px;"
        />
      </b-col>
    </b-container>
  </b-container>
</template>

<script>
import { mapState } from "vuex";
import config from "../config";
export default {
  name: "image-component",
  computed: {
    config: () => config,
    ...mapState({
      username: (state) => state.user.user.username,
      user: (state) => state.user.user,
    }),
  },
  methods: {
    likeImage() {
      this.$store.dispatch("image/likeImage", this.$props.image._id);
    },
    likedByUser() {
      if (!this.user || !this.image) return false;

      if (!this.image.likes) return false;

      for (let user of this.image.likes) {
        if (user._id == this.user.id) {
          return true;
        }
      }

      return false;
    },
    likeCount() {
      if (!this.image || !this.image.likes) return false;

      return this.image.likes.length;
    },
  },

  props: {
    image: Object,
  },
};
</script>

<style></style>
