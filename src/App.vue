<template>
  <div id="app">
    <VoteBox
      class="votebox hidden"
      href="<URL OF VOTING FORM>"
    />
    <ChallengeGrid src="https://hack.farming.opendata.ch/api/event/1/projects.json" />
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
.votebox {
  position: relative;
  margin-top: -35px;
}
.hidden {
  display: none;
}
</style>
