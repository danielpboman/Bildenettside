<template>
  <div class="q-gutter-sm">
    <q-chip>
      <q-avatar>
        <q-img :src="config.avatarPath(this.$props.avatarID)"></q-img>
      </q-avatar>
      {{ this.$props.username }}
    </q-chip>
  </div>
</template>
<!-- 
  <q-avatar size="48px">
    <q-img :src="config.avatarPath(this.$props.avatarID)"></q-img>
    {{ this.$props.username }}

    <div class="text-h6" style="font-color: red;">
      {{ this.$props.username }}
    </div>
    <slot name="extraLabels"></slot>
  </q-avatar>
-->

<script>
import config from "../services/config";

export default {
  name: "user",
  computed: {
    config: () => config
  },

  props: {
    id: String,
    avatarID: String,
    username: String
  }
};
</script>

<style></style>
