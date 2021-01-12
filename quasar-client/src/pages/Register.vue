<template>
  <form-component @submit="onSubmit">
    <template v-slot:additions>
      <q-file
        color="teal"
        filled
        v-model="avatar"
        :label="$t('avatar')"
        counter
        class="q-gutter-md q-mx-auto"
        accept="image/*"
      >
        <template v-slot:prepend>
          <q-icon name="cloud_upload" />
        </template>
      </q-file>
    </template>
  </form-component>
</template>

<script>
import FormComponent from "src/components/FormComponent.vue";
export default {
  name: "register",
  components: { FormComponent },
  data() {
    return {
      avatar: null
    };
  },
  methods: {
    onSubmit(reset, { username, password }) {
      this.$store
        .dispatch("user/register", {
          username,
          password
        })
        .then(
          data => {
            if (this.avatar) {
              this.$store.dispatch("user/setAvatar", avatar);
            }
          },
          error => {
            this.$q.notify({
              type: "negative",
              message: this.$t("failedRegister"),
              timeout: 2500
            });
          }
        );
    }
  }
};
</script>

<style></style>
