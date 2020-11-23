<template>
  <img class="image-component" :src="source" />
</template>

<script>
export default {
  name: "ImageComponent",
  props: {
    source: String,
  },
};
</script>

<style></style>
