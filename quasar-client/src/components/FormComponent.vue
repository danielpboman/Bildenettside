<template>
  <div class="q-pt-md q-mx-auto" style="max-width: 400px">
    <q-form class="q-mx-auto" @submit="this.onSubmit" @reset="this.onReset">
      <slot>
        <q-input
          filled
          v-model="username"
          :label="$t('yourUsername')"
          :hint="$t('yourUsernameHint')"
          :rules="[val => val.length >= 6]"
          autocorrect="off"
          spellcheck="false"
          autocapitalize="off"
          autocomplete="on"
        />
        <q-input
          filled
          v-model="password"
          :label="$t('yourPassword')"
          :hint="$t('yourPasswordHint')"
          :rules="[val => val.length >= 6]"
          autocorrect="off"
          spellcheck="false"
          autocapitalize="off"
          type="password"
          autocomplete="on"
        />
      </slot>

      <slot name="additions"> </slot>

      <slot name="buttons">
        <div class="q-pt-md">
          <q-btn :label="$t('submit')" type="submit" color="primary" />
          <q-btn
            class="q-ml-md"
            :label="$t('reset')"
            type="reset"
            color="warning"
          />
        </div>
      </slot>
    </q-form>
  </div>
</template>

<script>
import config from "../services/config";

export default {
  name: "form-component",
  comupted: {
    config: () => config
  },

  methods: {
    onSubmit(evt) {
      evt.preventDefault();

      this.$emit(
        "submit",
        () => {
          this.reset();
        },
        {
          username: this.username,
          password: this.password,
          avatar: this.avatar
        }
      );
    },
    onReset(evt) {
      this.reset();
    },
    reset() {
      this.username = "";
      this.password = "";
      this.avatar = null;
    }
  },

  data() {
    return {
      username: "",
      password: "",
      avatar: null
    };
  }
};
</script>

<style></style>
