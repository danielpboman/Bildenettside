<template>
  <div class="q-pa-md">
    <q-btn color="green" icon="settings" :label="$t('settings')">
      <q-popup-proxy>
        <div class="row no-wrap q-pa-md">
          <div class="column">
            <div class="text-overline q-ma-md">{{ $t("settings") }}</div>
            <div>
              <darkmode-toggle />
              <language-switcher />
            </div>
          </div>
        </div>
      </q-popup-proxy>
    </q-btn>
  </div>
</template>

<script>
import DarkmodeToggle from "./DarkmodeToggle.vue";
import LanguageSwitcher from "./LanguageSwitcher.vue";
import { mapState } from "vuex";
export default {
  name: "settings-component",
  components: { DarkmodeToggle, LanguageSwitcher },
  computed: {
    ...mapState({
      darkMode: (state) => state.settings.options["darkMode"],
      language: (state) => state.settings.options["language"],
    }),
  },

  created() {
    this.$q.dark.set(this.darkMode);
    this.$i18n.locale = this.language;
  },
};
</script>

<style></style>
