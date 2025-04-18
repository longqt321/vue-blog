import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import { createVuestic } from "vuestic-ui";
import "vuestic-ui/styles/essential.css";
import "vuestic-ui/styles/typography.css";
import App from "./App.vue";
import router from "./router.js";

const app = createApp(App);
const pinia = createPinia();
const vuestic = createVuestic();

app.use(pinia);
app.use(router);
app.use(vuestic);
app.mount("#app");
