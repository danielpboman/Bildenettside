<template>
  <div>
    <q-toggle
      v-model="darkMode"
      checked-icon="dark_mode"
      unchecked-icon="light_mode"
    />
  </div>
</template>
<!-- 
<q-btn
    size="10px"
    :icon="this.darkMode ? 'light_mode' : 'dark_mode'"
    @click="toggleDarkMode()"
  ></q-btn>

-->
<script>
import { SET_OPTION } from "src/store/settings/mutation-types";
export default {
  name: "darkmodetoggle",

  computed: {
    darkMode: {
      get() {
        return this.$store.state.settings.options["darkMode"];
      },
      set(value) {
        this.$store.commit(`settings/${SET_OPTION}`, {
          option: "darkMode",
          value: value,
        });

        this.$q.dark.set(value);
      },
    },
  },
};
</script>

<style></style>
