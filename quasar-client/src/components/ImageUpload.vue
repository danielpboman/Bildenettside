<template>
  <label>
    <input type="file" @change="changeFile" accept="image/*" />
    <q-icon name="cloud_upload" size="32px" />
  </label>
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

<!-- 
  <q-file
    bg-color="orange"
    filled
    flat
    v-model="file"
    :label="$t('imageUpload')"
    accept="image/*"
  >
    <template v-slot:prepend>
      <q-icon name="cloud_upload" />
    </template>
  </q-file>
-->
<script>
export default {
  name: "image-upload",
  data() {
    return {
      file: null,
      uploading: false
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
    changeFile(evt) {
      let file = evt.target.files[0];
      if (!file) {
        return;
      }

      this.file = file;
    }
  },
  watch: {
    uploading(uploading) {
      if (uploading) {
        this.$q.loadingBar.start(250);
      } else {
        this.$q.loadingBar.stop();
      }
    },
    async file(file) {
      console.log(file);
      if (!file || this.uploading) {
        return;
      }

      this.uploading = true;
      await this.$store.dispatch("image/createImage", file);
      this.uploading = false;
    }
  }
};
</script>
