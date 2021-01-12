<template>
  <q-layout>
    <q-page-container>
      <navbar-component />
    </q-page-container>
  </q-layout>
</template>

<script>
import NavbarComponent from "../components/Navbar";
export default {
  name: "MainLayout",
  components: { NavbarComponent }
};
</script>
