<template>
  <q-card v-if="this.findImageByID(this.$props.imageID) != null">
    <q-img
      :src="config.imagePath(this.$props.fileName)"
      transition="fade"
      style="width: 320px"
      spinner-color="primary"
      spinner-size="82px"
      @load="setShowImage"
    />
    <q-skeleton height="260px" square v-if="!showImage" />

    <q-card-actions>
      <like-btn
        :userID="this.userID"
        :imageID="this.$props.imageID"
        :fileName="this.$props.fileName"
      />
    </q-card-actions>
    <q-separator />

    <q-card-section>
      <div class="text-caption">
        {{ this.findImageByID(this.$props.imageID).uploaded.split("T")[0] }}
      </div>
      <div class="text-overline">{{ $t("uploadedBy") }}</div>
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
  methods: {
    setShowImage() {
      this.showImage = !this.showImage;
    }
  },
  props: {
    imageID: String,
    fileName: String
  },
  data() {
    return {
      showImage: false
    };
  }
};
</script>

<style></style>
