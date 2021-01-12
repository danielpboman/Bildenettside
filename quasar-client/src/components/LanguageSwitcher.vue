<template>
  <q-select
    v-model="lang"
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
import { options } from "../i18n";
export default {
  name: "language-switcher",
  computed: {
    options: () => options
  },
  data() {
    return {
      lang: this.$i18n.locale
    };
  },
  created() {
    this.lang = localStorage.getItem("language") || "nb-no";
  },
  watch: {
    lang(lang) {
      this.$i18n.locale = lang;
      localStorage.setItem("language", lang);
    }
  }
};
</script>
