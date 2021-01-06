<template>
  <b-container class="item">
    <b-img-lazy
      rounded
      v-b-modal="`popout-${this.$props.id}`"
      style="max-width:100%; max-height:100%;"
      :src="config.imagePath(this.$props.id)"
    />
    <b-modal size="xl" :id="`popout-${this.$props.id}`" hide-footer hide-header>
      <b-container
        class="d-flex justify-content-center"
        style="max-width:100%; max-height=50%;"
      >
        <div>
          <b-img-lazy
            style="max-width:100%; max-height=100%;"
            :src="config.imagePath(this.$props.id)"
          >
          </b-img-lazy>

          <b-container class="d-flex justify-content-center">
            <b>
              {{ this.$props.author }}
            </b>
          </b-container>
          <b-container class="d-flex justify-content-center">
            <b-button variant="outline-dark" @click="likeImage()">
              <b-icon :icon="likedByUser ? 'heart-fill' : 'heart'"></b-icon>
              {{ this.$props.likes }}
            </b-button>
          </b-container>
        </div>
      </b-container>
    </b-modal>
  </b-container>
</template>

<!-- 
    <b-img-lazy
      :src="config.imagePath(this.$props.image._id)"
    />

        <b-button variant="outline-dark" @click="likeImage()">
      <b-icon :icon="likedByUser ? 'heart-fill' : 'heart'"> </b-icon>
      {{ this.likeCount() }}
    </b-button>
    
    <p>
      {{ "Lastet opp av " + this.image.author.username }}
    </p>
-->
<script>
import { mapGetters, mapState } from "vuex";
import config from "../config";
export default {
  name: "image-component",
  data() {
    return {
      anim: "",
    };
  },
  computed: {
    likedByUser() {
      return (
        this.likedImages.findIndex((x) => x._id == this.$props.id) != -1 ||
        this.liked
      );
    },
    config: () => config,
    ...mapState({
      username: (state) => state.user.user.username,
      user: (state) => state.user.user,
    }),
    ...mapGetters("image", ["likedImages"]),
  },
  methods: {
    hoverOver: function() {
      this.anim = ["item-move"];
    },
    hoverOut: function() {
      this.anim = [];
    },
    async likeImage() {
      if (this.likedByUser) {
        await this.$store.dispatch("image/dislikeImage", this.$props.id);
        this.liked = false;

        return;
      }

      await this.$store.dispatch("image/likeImage", this.$props.id);
      this.liked = true;
    },
  },

  data() {
    return {
      liked: false,
    };
  },

  props: {
    id: String,
    author: String,
    likes: Number,
  },
};
</script>

<style>
.item:hover {
  animation: out 1.5s;
  animation-fill-mode: forwards;
}

@keyframes out {
  from {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
  }
  100% {
    transform: scale(1.15556);
  }
}

.item {
  scale: 1;
  transition: scale 0.25s;
}
</style>
