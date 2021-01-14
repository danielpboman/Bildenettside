<template>
  <q-btn color="purple" icon="cloud_upload" :label="$t('upload')">
    <q-popup-proxy fit ref="upload_proxy_menu">
      <q-file v-model="file" :label="$t('pickFile')" use-chips filled />
      <q-btn :label="$t('submit')" @click="upload" />
    </q-popup-proxy>
  </q-btn>
</template>

<script>
export default {
  name: "image-upload",
  data() {
    return {
      uploading: false,
      file: null
    };
  },
  created() {
    this.$q.loadingBar.setDefaults({
      color: "primary",
      size: "3px",
      position: "bottom"
    });
  },

  methods: {
    async upload() {
      if (!this.file || this.uploading) {
        return;
      }
      this.$refs.upload_proxy_menu.hide();

      this.uploading = true;
      await this.$store.dispatch("image/createImage", this.file);
      this.uploading = false;
    }
  },
  watch: {
    uploading(uploading) {
      if (uploading) {
        this.$q.loadingBar.start(100);
      } else {
        this.$q.loadingBar.stop();
      }
    }
  }
};
</script>
