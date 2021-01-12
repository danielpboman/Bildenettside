<template>
  <q-card v-if="this.findImageByID(this.$props.imageID) != null">
    <q-img
      :src="config.imagePath(this.$props.imageID)"
      transition="fade"
      style="width: 320px"
      spinner-color="primary"
      spinner-size="82px"
    />

    <q-card-actions>
      <like-btn :userID="this.userID" :imageID="this.$props.imageID" />
    </q-card-actions>
    <q-separator />

    <q-card-section>
      <div class="text-caption">
        {{ this.findImageByID(this.$props.imageID).uploaded.split("T")[0] }}
      </div>
      <div class="text-caption">{{ $t("uploadedBy") }}</div>
      <user
        :id="this.findImageByID(this.$props.imageID).author._id"
        :avatarID="this.findImageByID(this.$props.imageID).author.avatar"
        :username="this.findImageByID(this.$props.imageID).author.username"
      />
    </q-card-section>
  </q-card>
</template>

<!--
  <div class="q-pa-md row items-start q-gutter-md" style="max-width: 360px">
  </div>


-->
<script>
import config from "../services/config";
import User from "./User.vue";
import LikeBtn from "./LikeBtn.vue";
import { mapGetters, mapState } from "vuex";

export default {
  name: "image-component",
  components: { User, LikeBtn },
  computed: {
    config: () => config,
    ...mapGetters({
      findImageByID: "image/findImageByID"
    }),
    ...mapState({
      userID: state => {
        if (state.user && state.user.user && state.user.user.id) {
          return state.user.user.id;
        }
        return undefined;
      }
    })
  },
  props: {
    imageID: String
  }
};
</script>

<style></style>
