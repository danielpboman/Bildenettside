<template>
  <q-btn @click="toggleLike" flat>
    <q-icon
      :name="
        isImageLikedByUser(this.$props.userID, this.$props.imageID)
          ? 'favorite'
          : 'favorite_border'
      "
    >
    </q-icon>
    {{ this.getLikeCount(this.$props.imageID) }}
  </q-btn>
</template>

<script>
import { mapGetters } from "vuex";
import { Router } from "../router";
export default {
  name: "like-btn",

  computed: {
    ...mapGetters({
      isImageLikedByUser: "image/isImageLikedByUser",
      getLikeCount: "image/getLikeCount"
    })
  },

  methods: {
    async toggleLike() {
      if (!this.$props.userID) {
        Router.replace("/login");
        return;
      }

      let isLiked = this.isImageLikedByUser(
        this.$props.userID,
        this.$props.imageID
      );

      if (this.liking) return;

      this.liking = true;

      if (isLiked) {
        let image = await this.$store.dispatch(
          "image/dislikeImage",
          this.$props.imageID
        );

        this.liking = false;

        return;
      }
      let image = await this.$store.dispatch(
        "image/likeImage",
        this.$props.imageID
      );

      this.liking = false;
    }
  },

  data() {
    return {
      liking: false
    };
  },

  props: {
    imageID: String,
    userID: String
  }
};
</script>

<style></style>
