import { createApp } from "vue";
import App from "./App.vue";
import "primeflex/primeflex.css";

const app = createApp(App);

app.config.globalProperties.$primevue = { ripple: true };

app.mount("#app");
