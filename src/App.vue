<template>
  <div id="app">
    <div class="header">
      <h1 class="title">#geohackmin</h1>
    </div>
    <!--<VoteBox
      class="votebox"
      href="https://docs.google.com/forms/d/e/1FAIpQLSdD7yWFhgBXHpcLhvVzcYra8zJyxnIrC5Djzea7MLFVG83aug/viewform?embedded=true"
    />-->
    <ChallengeGrid src="https://hack.opendata.ch/api/event/35/projects.json" />
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
  background-color: #3cf;
}
.header {
  height: 500px;
  width: 100%;
  background-image: url("./cividi_future.jpg");
  background-size: cover;
  background-repeat: no-repeat;
}
h1.title {
  font-style: italic;
  position: relative;
  top: 15em;
  margin: 0px;
  line-height: 0px;
}
.votebox {
  position: relative;
  margin-top: -35px;
}
</style>
