<template>
  <q-select
    v-model="language"
    :options="this.options"
    borderless
    emit-value
    map-options
    dense
    options-dense
    style="max-width: 70px
             max-height: 50px
             overflow: hidden;
      "
    transition-show="scale"
    transition-hide="scale"
  />
</template>

<script>
import { SET_OPTION } from "src/store/settings/mutation-types";

import { options } from "../i18n";

export default {
  name: "language-switcher",
  computed: {
    options: () => options,
    language: {
      get() {
        return this.$store.state.settings.options["language"];
      },
      set(value) {
        this.$store.commit(`settings/${SET_OPTION}`, {
          option: "language",
          value: value,
        });
        this.$i18n.locale = value;
      },
    },
  },
};
</script>
