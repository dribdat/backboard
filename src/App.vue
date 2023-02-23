<template>
  <div id="app">
    <VoteBox class="votebox"
      :href="voteUrl" v-show="voteUrl" />
    <Challenges
      :src="dribdatApi" :toolbar="showToolbar" :options="defaultOptions" />
    <tt>
      <button v-if="allowToolbar" class="small" @click="toggleOptions">options</button>
      <a href="https://github.com/dribdat/backboard" target="_blank" style="text-decoration:none">backboard//</a>
      powered by <a href="https://dribdat.cc" target="_blank">dribdat</a>
    </tt>
  </div>
</template>

<script>
import Challenges from "./components/Challenges";
import VoteBox from "./components/VoteBox";

export default {
  name: "App",
  components: {
    Challenges,
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
      apiUrl = [baseUrl, "api/event", eventId, "datapackage.json"].join("/");
    }
    return {
      dribdatApi: apiUrl,
      dribdatHome: baseUrl || '#top',
      voteUrl: process.env.VUE_APP_VOTE_FORM_URL || '',
      showToolbar: false,
      allowToolbar: !(Boolean(process.env.VUE_APP_HIDE_TOOLBAR) || false),
      defaultOptions: process.env.VUE_APP_DEFAULT_OPTS || '',
    }
  },
  methods: {
    toggleOptions() {
      this.showToolbar = !this.showToolbar;
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
i.fa {
  font-style: normal;
}
body {
  color: #000;
  background-color: transparent;
}
tt { color: black; }
.votebox {
  margin: 2em;
}
a:active, a:hover {
  outline-width: 0;
}
button {
  color: blue;
  background: white;
  border: 1px solid rgba(200,200,255,0.7);
  box-shadow: 2px 2px 2px lightgray;
  margin: 0 2px 2px 0;
  font-size: 26px;
  font-weight: 500;
  border-radius: 4px;
  text-decoration: none;
  cursor: pointer;
  padding: 6px 10px;
}
button:hover {
  background: lightyellow;
  color:  black;
}
button:active {
  background: lightskyblue;
  box-shadow: none;
  margin: 2px 0 0 2px;
}
button.big {
  display: inline-flex;
  -moz-box-align: center;
  align-items: center;
  height: 32px;
  padding: 0px 12px;
}
button.small { 
  font-size: 90%;
  padding: 6px;
  margin: 0px 16px;
}
button.tiny {
  line-height: 1.6em;
  height: 30px;
  width: 30px;
  overflow: hidden;
  display: block;
  margin-bottom: 1em;
}
button.tiny:hover {
  width: auto;
}
button.modal-close-button {
  background: transparent;
  border: none;
  box-shadow: none;
  padding: 0;
}
</style>
