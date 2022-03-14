<template>
  <div id="app">
    <VoteBox class="votebox" :href="voteUrl" v-show="voteUrl" />
    <ChallengeGrid :src="dribdatApi" />
    <tt><a href="https://github.com/dribdat/backboard" target="_blank" style="text-decoration:none">backboard//</a>
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
    let apiUrl = null;
    let eventId = null;
    let baseUrl = process.env.VUE_APP_DRIBDAT_URL;
    if (baseUrl && !eventId && baseUrl.indexOf('/event/')>0) {
      eventId = baseUrl.match('/event/([0-9]+)');
      if (eventId !== null) {
        eventId = eventId[1];
        baseUrl = baseUrl.substring(0, baseUrl.indexOf('/event/'));
      }
    } else if (!baseUrl) {
      apiUrl = './datapackage.json';
    }
    if (baseUrl && eventId) {
      apiUrl = [baseUrl, "api/event", eventId, "projects.json"].join("/");
    }
    return {
      dribdatApi: apiUrl,
      dribdatHome: baseUrl || '#top',
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
  color: #000;
  background-color: transparent;
}
tt { color: black; }
.votebox {
  margin: 2em;
}
</style>
