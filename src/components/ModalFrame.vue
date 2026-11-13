<template>
  <section>
    <button @click="isVoteActive = true">🗳️ Contribute</button>

    <Modal v-if="isVoteActive" @close="isVoteActive = false">
      <div class="content" slot="body">
        <iframe
          :src="framesrc"
          width="100%"
          height="460px"
          frameborder="0"
          marginheight="0"
          marginwidth="0"
          sandbox="allow-scripts allow-same-origin allow-forms"
          >Loading…</iframe
        >
      </div>
    </Modal>
  </section>
</template>

<script>
import Modal from "./Modal"

export default {
  name: "ModalFrame",
  props: {
    href: String,
  },
  components: {
    Modal,
  },
  methods: {
    isValidUrl(url) {
      return url && (url.startsWith("http://") || url.startsWith("https://"));
    },
  },
  data() {
    return {
      framesrc: null,
      isVoteActive: false,
    };
  },
  mounted() {
    let formref = this.href;
    if (formref.indexOf("/") < 0) return;

    // Use embedded URL for Google Forms
    if (formref.indexOf("https://docs.google.com/forms") == 0) {
      formref = formref.split("/");
      formref = formref[formref.length - 2];
      formref = formref.split("?")[0];
      formref = "https://docs.google.com/forms/d/e/" + formref;
      formref = formref + "/viewform?embedded=true";
    }

    this.framesrc = this.isValidUrl(formref) ? formref : null;
  },
};
</script>

<style scoped>
button {
  font-size: 150%;
}
</style>
