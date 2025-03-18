import Vue from "vue";
import App from "./App.vue";
Vue.config.productionTip = false;

/* Create the app */
new Vue({
  render: h => h(App)
}).$mount("#app");
