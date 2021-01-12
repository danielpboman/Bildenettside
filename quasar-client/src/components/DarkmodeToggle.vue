<template>
  <q-btn
    size="10px"
    :icon="this.darkMode ? 'light_mode' : 'dark_mode'"
    @click="toggleDarkMode()"
  ></q-btn>
</template>

<script>
export default {
  name: "darkmodetoggle",

  created() {
    this.$q.dark.set(this.darkMode);
  },
  methods: {
    toggleDarkMode() {
      this.$q.dark.toggle();

      localStorage.setItem("darkMode", this.$q.dark.isActive);
      this.darkMode = this.$q.dark.isActive;
    }
  },
  data() {
    return { darkMode: localStorage.getItem("darkMode") === "true" || true };
  }
};
</script>

<style></style>
