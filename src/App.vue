<template>
  <div id="app" :class="darkClass">
    <ModalFrame class="framebox"
      :href="voteUrl" v-show="voteUrl" />
    <Challenges
      @closeToolbar="toggleOptions"
      @previewOff="previewOff"
      @previewOn="previewOn"
      @darkMode="darkMode"
      :toolbar="showToolbar" 
      :options="defaultOptions"
      :dribs="dribdatDribs"
      :src="dribdatApi || dribdatHome" />
    <tt class="app-footer">
      // human sourced with <a href="https://dribdat.cc" target="_blank">dribdat</a>
      &#x1F3C0;
      <a v-if="allowToolbar" @click="toggleOptions" class="options"><span>options</span></a>
    </tt>
  </div>
</template>

<script>
import Challenges from "./components/Challenges";
import ModalFrame from "./components/ModalFrame";

export default {
  name: "App",
  components: {
    Challenges,
    ModalFrame,
  },
  data() {
    let apiUrl = null;
    let dribUrl = null;
    let eventId = null;
    let baseUrl = process.env.VUE_APP_DRIBDAT_URL || null;
    if (baseUrl && !eventId && baseUrl.indexOf('/event/')>0) {
      eventId = baseUrl.match('/event/([0-9]+)');
      if (eventId !== null) {
        eventId = eventId[1];
        baseUrl = baseUrl.substring(0, baseUrl.indexOf('/event/'));
      }
    } else if (!baseUrl) {
      apiUrl = './datapackage.json';
      dribUrl = './posts.json';
    } else if (baseUrl.endsWith('datapackage.json')) {
      apiUrl = baseUrl;
      dribUrl = baseUrl.replace('datapackage.json', 'posts.json');
    }
    if (baseUrl && eventId) {
      apiUrl = [baseUrl, "api/event", eventId, "datapackage.json"].join("/");
      dribUrl = [baseUrl, "api/event", eventId, "posts.json?limit=200"].join("/");
    }
    let my_config = {
      dribdatApi: apiUrl,
      dribdatHome: baseUrl || '#top',
      dribdatDribs: dribUrl || process.env.VUE_APP_DRIBS_URL || '',
      voteUrl: process.env.VUE_APP_VOTE_FORM_URL || '',
      allowToolbar: !(Boolean(process.env.VUE_APP_HIDE_TOOLBAR) || false),
      defaultOptions: process.env.VUE_APP_DEFAULT_OPTS || '',
      showToolbar: false,
      darkClass: '',
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
    darkMode(value) {
      if (value == 'default' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        value = 'dark';
      }
      if (value == 'dark') {
        this.darkClass = 'dark';
        document.body.style.backgroundColor = 'black';
      } else {
        this.darkClass = '';
        document.body.style.backgroundColor = '';
      }
      return '';
    },
  }
};
</script>

<style>

@font-face{
  font-family: M3Regular;
  src: url(./assets/m3regular-webfont.woff2) format("woff2"),
       url(./assets/m3regular-webfont.woff) format("woff");
  font-style: normal;
}

#app {
  font-family: M3Regular,"Open Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
  /*font-family: "Avenir", Helvetica, Arial, sans-serif;*/
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
.description {
  font-family: "Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}
#app.dark {
  background: black;
  color: white;
}
i.fa {
  font-style: normal;
}
body {
  color: #000;
  background-color: transparent;
}
.framebox {
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
.description img,
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

.btn, button {
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
  display: inline-block;
}
.btn {
  font-size: initial;
  margin-bottom: 1em;
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

.app-footer {
  opacity: 0.6;
}
.app-footer:hover {
  opacity: 1;
}
a.options {
  border: 1px solid transparent;
  padding: 2px 5px;
}
a.options:hover {
  border: 1px solid orange;
}
.options .modal-close-button {
  margin-top: -18px;
  margin-right: 10px;
}
.modal-container {
  padding: 1em 0em;
  width: 80%;
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
