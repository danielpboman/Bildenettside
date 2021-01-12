<template>
  <form-component @submit="onSubmit"> </form-component>
</template>

<script>
import FormComponent from "../components/FormComponent.vue";
import { SET_AVATAR } from "../store/user/mutation-types";

export default {
  name: "login",
  components: { FormComponent },
  methods: {
    async onSubmit(reset, { username, password }) {
      try {
        await this.$store.dispatch("user/login", {
          username: username,
          password: password
        });
        this.$router.replace("/images");
        reset();
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>

<style></style>
