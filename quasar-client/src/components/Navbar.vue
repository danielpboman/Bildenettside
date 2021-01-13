<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title> Bildenettside </q-toolbar-title>
        <q-tabs align="left">
          <q-route-tab to="/images" :label="$t('images')" />
          <q-route-tab
            to="/login"
            :label="$t('login')"
            v-if="this.user.user === null"
          />

          <q-route-tab
            to="/register"
            :label="$t('register')"
            v-if="this.user.user === null"
          />
        </q-tabs>
        <q-tabs class="q-ml-xl">
          <div class="q-pr-md">
            <image-upload v-if="this.user.user !== null" />
          </div>
          <settings />
        </q-tabs>
      </q-toolbar>

      <q-tabs align="right" v-if="this.user.user !== null"> </q-tabs>
    </q-header>

    <q-footer class="bg-primary text-white">
      <q-toolbar>
        <q-tabs>
          <q-btn
            icon="arrow_circle_up"
            :label="$t('backToTop')"
            @click="scrollUp()"
          />
        </q-tabs>
      </q-toolbar>
    </q-footer>

    <!-- 
  <q-avatar> <q-img :src="this.user.user.avatar" </q-avatar>


    <q-drawer show-if-above v-model="left" side="left" bordered>
    </q-drawer> 
-->
    <q-page-container>
      <transition
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
        appear
        :duration="300"
      >
        <router-view />
      </transition>
    </q-page-container>
  </q-layout>
</template>

<script>
import config from "../services/config";

import { mapState } from "vuex";
import ImageUpload from "./ImageUpload.vue";
import Settings from "./Settings.vue";
export default {
  name: "navbar-component",
  components: {
    ImageUpload,
    Settings,
  },
  computed: {
    ...mapState(["user"]),

    config: () => config,
    showScrollButton: () => {
      return null;
    },
  },
  methods: {
    scrollUp() {
      window.scrollTo(0, 0);
    },
    toggleDarkMode() {
      this.$q.dark.toggle();

      localStorage.setItem("darkMode", this.$q.dark.isActive);
      this.darkMode = this.$q.dark.isActive;
    },
  },
  created() {},
};
</script>
