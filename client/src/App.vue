<template>
  <div id="app">
    <div class="app-container">
      <FileUpload
        :customUpload="true"
        name="file[]"
        @uploader="uploadFile"
        accept="image/*"
        :auto="true"
      >
        <template #empty>
          <p>Drag and drop files to here to upload.</p>
        </template>
      </FileUpload>
    </div>
  </div>
</template>

<!-- 
  <div>
    <input id="file" ref="file" type="file" @change="onFileChanged()" /><button
      class="btn btn-primary"
      @click="uploadFile"
    >
      Upload
    </button>
  </div>

  <div>
    <h1>
      Bilder
    </h1>
    <ul class="list-group" v-for="image in images" :key="image">
      <li class="list-group-item align-items-center">
        <img class="horizontalImage" :src="baseURL + '/image?id=' + image" />
      </li>
    </ul>
  </div>
-->

<script>
import axios from "axios";
import FileUpload from "primevue/fileupload";

export default {
  name: "App",
  components: {
    FileUpload,
  },
  computed: {
    console: () => console,
  },
  data() {
    return {
      selectedFile: null,
      images: [],
      baseURL: "http://192.168.2.153:80",
    };
  },
  mounted() {
    this.fetchImages.bind(this)();
    this.timer = setInterval(this.fetchImages.bind(this), 15000);
  },
  beforeUnmount() {
    clearInterval(this.timer);
  },

  methods: {
    async fetchImages() {
      try {
        const imgs = await axios.get(`${this.baseURL}/images`);
        this.images = imgs.data;
      } catch (error) {
        console.error(error);
      }
    },

    uploadFile(event) {
      let post = new FormData();
      for (let file in event) {
        if (file && file instanceof File) {
          post.append("file", file);
        }
      }
      axios
        .post(`${this.baseURL}/upload`, post)
        .catch((err) => console.error("error uploading files: " + err));
      this.fetchImages.bind(this)();
    },
    uploadFileOld() {
      if (this.selectedFile && this.selectedFile instanceof File) {
        let post = new FormData();
        post.append("file", this.selectedFile);
        axios
          .post(`${this.baseURL}/upload`, post)
          .then(() => {
            console.log("uploaded successfully");
          })
          .catch((err) => {
            console.error("error uploading file: " + err);
          });
        this.fetchImages.bind(this)();
      }
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

img.horizontalImage {
  height: auto;
  max-width: 100%;
}
</style>
