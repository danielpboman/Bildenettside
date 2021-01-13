<template>
  <q-btn color="purple" icon="cloud_upload" :label="$t('upload')">
    <q-popup-proxy fit ref="upload_proxy_menu">
      <q-file v-model="file" :label="$t('pickFile')" use-chips filled />
      <q-btn :label="$t('submit')" @click="upload" />
    </q-popup-proxy>
  </q-btn>
</template>

<style lang="scss">
input[type="file"] {
  display: none;
}

.file-upload {
  border: 2px solid #ccc;
  display: inline-block;
  padding: 6px 12px;
  cursor: pointer;
}
</style>

<script>
export default {
  name: "image-upload",
  data() {
    return {
      uploading: false,
      file: null,
    };
  },
  created() {
    this.$q.loadingBar.setDefaults({
      color: "primary",
      size: "3px",
      position: "bottom",
    });
  },

  methods: {
    async upload() {
      if (!this.file || this.uploading) {
        return;
      }
      this.$refs.upload_proxy_menu.hide();

      this.uploading = true;
      await this.$store.dispatch("image/createImage", file);
      this.uploading = false;
    },
  },
  watch: {
    uploading(uploading) {
      if (uploading) {
        this.$q.loadingBar.start(100);
      } else {
        this.$q.loadingBar.stop();
      }
    },
  },
};
</script>
