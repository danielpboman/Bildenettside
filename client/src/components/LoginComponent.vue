<template>
  <b-jumbotron class="login-padding mx-auto">
    <b-overlay :show="user.loggingIn || !show || user.token != null">
      <b-form @submit="this.onSubmit" @reset="this.onReset">
        <b-form-group id="input-group-1" label="Brukernavn" label-for="input-1">
          <b-form-input
            id="input-1"
            v-model="form['username']"
            type="text"
            placeholder="Skriv brukernavnet ditt her..."
            :state="this.validateUsername"
            required
          >
          </b-form-input>
          <b-form-invalid-feedback :state="validateUsername">
            Brukernavnet må være minst 6 karakterer langt.
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group id="input-group-2" label="Passord" label-for="input-2">
          <b-form-input
            id="input-2"
            v-model="form['password']"
            type="password"
            placeholder="Skriv passordet ditt her..."
            :state="this.validatePassword"
            required
          >
          </b-form-input>
          <b-form-invalid-feedback :state="validatePassword">
            Passordet må være minst 6 karakterer langt.
          </b-form-invalid-feedback>
        </b-form-group>
        <b-button type="submit" variant="primary" class="float-left"
          >Konfirmer</b-button
        >
        <b-button type="reset" variant="danger" class="float-right"
          >Tilbakestill</b-button
        >
      </b-form>
    </b-overlay>
  </b-jumbotron>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "login-component",
  computed: {
    ...mapState(["user"]),
    validateUsername() {
      return this.form.username.length >= 6;
    },
    validatePassword() {
      return this.form.password.length >= 6;
    },
  },
  data() {
    return {
      form: {
        username: "",
        password: "",
      },
      show: true,
    };
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();

      this.$store.dispatch("user/login", JSON.stringify(this.form));
      this.reset();
    },
    onReset(evt) {
      evt.preventDefault();
      this.reset();
    },
    reset() {
      this.form.username = "";
      this.form.password = "";

      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    },
  },
};
</script>

<style></style>
