<template>
  <b-container>
    <navbar-component class="mb-5" />
    <router-view />
  </b-container>
</template>

<script>
import NavbarComponent from "./components/NavbarComponent.vue";
export default {
  name: "app",
  components: {
    NavbarComponent,
  },
};
</script>

<style></style>
