<template>
  <section>
    <button @click="isVoteActive = true">🗳️ Vote now!</button>

    <Modal v-if="isVoteActive" @close="isVoteActive = false">
      <div class="content" slot="body">
        <iframe
          :src="framesrc"
          width="100%"
          height="460px"
          frameborder="0"
          marginheight="0"
          marginwidth="0"
          >Loading…</iframe
        >
      </div>
    </Modal>
  </section>
</template>

<script>
import Modal from "./Modal";

export default {
  name: "VoteBox",
  props: {
    href: String,
  },
  components: {
    Modal,
  },
  data() {
    return {
      framesrc: null,
      fullhref: null,
      isVoteActive: false,
    };
  },
  mounted() {
    let formref = this.href;
    if (formref.indexOf("/") < 0) return;
    formref = formref.split("/");
    formref = formref[formref.length - 2];
    formref = formref.split("?")[0];
    formref = "https://docs.google.com/forms/d/e/" + formref;
    this.framesrc = formref + "/viewform?embedded=true";
    this.fullhref = formref + "?usp=sf_link";
  },
};
</script>

<style scoped>
button {
  font-size: 150%;
}
</style>
