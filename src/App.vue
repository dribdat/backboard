<template>
  <div id="app">
    <VoteBox class="votebox" :href="voteUrl" v-show="voteUrl" />
    <ChallengeGrid :src="dribdatApi" />
    <tt><a :href="dribdatHome" target="_blank" style="text-decoration:none">//challenges//</a>
      powered by <a href="https://dribdat.cc" target="_blank">dribdat</a></tt>
  </div>
</template>

<script>
import ChallengeGrid from "./components/ChallengeGrid";
import VoteBox from "./components/VoteBox";

export default {
  name: "App",
  components: {
    ChallengeGrid,
    VoteBox,
  },
  data() {
    return {
      dribdatHome: process.env.VUE_APP_DRIBDAT_URL, 
      dribdatApi: process.env.VUE_APP_DRIBDAT_URL + 
        "/api/event/" + process.env.VUE_APP_DRIBDAT_EVENT + 
        "/projects.json",
      voteUrl: process.env.VUE_APP_GOOGLE_FORM_URL || '',
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
body {
  color: #fff;
  background-color: rgb(241, 238, 219);
}
tt { color: black; }
.votebox {
  margin: 2em;
}
</style>
