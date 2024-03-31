<template>
  <div id="app" class="dark">
    <VoteBox class="votebox"
      :href="voteUrl" v-show="voteUrl" />
    <Challenges
      @closeToolbar="toggleOptions()"
      @previewOff="previewOff()"
      @previewOn="previewOn()" 
      :src="dribdatApi || dribdatHome" :toolbar="showToolbar" :options="defaultOptions" />
    <tt>
      <a href="https://github.com/dribdat/backboard" target="_blank" style="text-decoration:none">backboard//</a>
      powered by <a href="https://dribdat.cc" target="_blank">dribdat</a> &#x1F3C0;
      <a v-if="allowToolbar" @click="toggleOptions">options</a>
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
    let my_config = {
      dribdatApi: apiUrl,
      dribdatHome: baseUrl || '#top',
      voteUrl: process.env.VUE_APP_VOTE_FORM_URL || '',
      allowToolbar: !(Boolean(process.env.VUE_APP_HIDE_TOOLBAR) || false),
      defaultOptions: process.env.VUE_APP_DEFAULT_OPTS || '',
      showToolbar: false,
    }
    //console.debug(my_config);
    return my_config;
  },
  methods: {
    toggleOptions() {
      this.showToolbar = !this.showToolbar;
    },
    previewOff() {
      document.body.style.overflowY = '';
    },
    previewOn() {
      document.body.style.overflowY = 'hidden';
    },
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
#app.dark {
  background: black;
  color: white;
}
html, body {
  background: black;
}
i.fa {
  font-style: normal;
}
body {
  color: #000;
  background-color: transparent;
}
.votebox {
  margin: 2em;
}
a:active, a:hover {
  outline-width: 0;
  color: #91170a;
  text-decoration: underline;
  cursor: pointer;
}
a {
  color: #d9230f;
  text-decoration: none;
  background-color: transparent;
}
.content img,
.preview img {
  max-width: 100% !important;
}
.preview > p:first-child {
  margin: 0;
}
.preview > p {
  margin-bottom: 1em;
}

.modal-container:active, .modal-container:hover {
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

.options .modal-close-button {
  margin-top: -18px;
}
button.modal-close-button {
  background: transparent;
  border: none;
  box-shadow: none;
  padding: 0px;
  opacity: 0.5;
}
button.modal-close-button:hover {
  opacity: 1;
}
</style>
