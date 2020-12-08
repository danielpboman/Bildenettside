<template>
  <b-navbar id="nav" variant="dark" type="dark" fixed="top">
    <b-navbar-brand>Bildenettside</b-navbar-brand>
    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item to="/images" :disabled="this.$route == '/images'"
          >Bilder</b-nav-item
        >
        <b-nav-item to="/login" :disabled="this.$route == '/login'"
          >Login</b-nav-item
        >
        <b-nav-item to="/register" :disabled="this.$route == '/register'"
          >Register</b-nav-item
        >
      </b-navbar-nav>
    </b-collapse>
    <b-navbar-nav class="mb-auto ml-auto">
      <b-form @submit="uploadFile" v-if="user.user != null" inline>
        <b-input-group>
          <b-form-file
            v-model="files"
            :state="Boolean(files)"
            drop-placeholder="Slipp filen her"
            accept="image/jpeg, image/png, image/gif"
          >
          </b-form-file>
          <b-input-group-append class="ml-2">
            <b-button pill type="submit" variant="outline-light">
              Last opp
            </b-button>
          </b-input-group-append>
        </b-input-group>
      </b-form>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "navbar-component",
  data() {
    return {
      files: null,
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    uploadFile(evt) {
      evt.preventDefault();

      if (this.files == null) return;
      console.log(this.files);
      this.files = null;
    },
  },
};
</script>

<style></style>
