<template>
  <div class="previews">
    <div v-for="project in projects" :key="project.id">
      <Modal v-if="active == project.id"
             @close="selectNone()"
             @prev="goPrev(project)"
             @next="goNext(project)"
             >
        <div slot="title"
             @touchstart="touchStart"
             title="Swipe here or tap below to advance"
            :style="'border-bottom: 4px solid ' + (project.logo_color ? project.logo_color : '#ccc')"
             >

          <div class="imagepreview"
               v-if="project.image_url">
            <div class="imagepreview-overlay" v-if="false"
                 :style="'background-image:url(' + project.image_url + ')'">
            </div>
            <div class="imagepreview-underlay" v-if="false"
                 :style="'background-image:url(' + project.image_url + ')'">
            </div>
            <a class="imagepreview-floating"
                title="Open image"
                :href="project.image_url" target="_blank"
                :style="'background-image:url(' + project.image_url + ')'"></a>
          </div>

          <div class="name">{{ project.name }}</div>

          <div class="ident">{{ project.ident }}</div>
          <div class="hashtag">{{ project.hashtag }}</div>
          <div class="teamroster" v-for="person in project.team">
            <span>{{ person }}</span>
          </div>

          <div v-show="project.summary" class="summary">
            <p>{{ project.summary }}</p>
          </div>

          <div class="status">
            <span class="phase" title="Current project phase">
              {{ project.phase }}
            </span>
            <button title="Open project page" 
                   @click="seeDetails(project.url)">
                   ◳ Open
            </button>
            <button v-if="isEmbeddable(project)"
                    title="Open in a new window" 
                   @click="seeEmbed(project)">
                   ⧐ View</button>
            <button v-if="project.download_url"
                    title="Open demo or download link"
                    @click="seeDetails(project.download_url)">
                   ⧨ Demo</button>

            <button v-if="withButtons" 
                    @click="joinTeam(project)" 
                    title="Join this team">🏀 Join</button>

            <button v-if="withComments" 
                    @click="openComment(project)" 
                    title="Write a comment to the team">🗨️ Comment</button>  

            <button v-if="withButtons" v-show="project.contact_url" 
                    @click="contactTeam(project)" 
                    title="Open the contact page">👋 Contact</button>
          </div>
        </div>
        <div class="content" slot="body">

          <div class="preview" v-if="showExcerpt">

            <markdown class="excerpt" 
                     v-if="!isEmbeddable(project) && !project.longtext && project.excerpt"
                     :source="project.excerpt" 
                     :postrender="tweakPreview"
                     :html="true" />

            <iframe class="webembed"
                    v-if="isEmbeddable(project)"
                    :src="getEmbed(project)"></iframe>

            <div class="webembed-fullscreen"
                 v-if="isEmbeddable(project) && fullscreen">

              <div id="ruigehond" :class="'' + ruigehond<100 ? '' : 'finished'">
                <div role="progressbar" aria-valuemin="0" aria-valuemax="100" tabindex="-1" title="Time remaining"
                    :style="'width:' + ruigehond + '%;background:rgb(' + (ruigehond*2) + ',0,0);'"
                    :aria-valuenow="ruigehond"></div>
              </div>

              <div class="fullscreen-controls">
                <!--
                  // Time remaining
                  // Event name
                  // Focused
                -->
                <button @click="toggleFullscreen()" title="Close fullscreen">▲</button>
              </div>
              <iframe class="webembed" id="webembedframe"
                    :src="getEmbed(project)"></iframe>
            </div>
            <button v-if="isEmbeddable(project)"
                    class="go-fullscreen" @click="toggleFullscreen()" title="Open in full screen mode">⧐<span>&nbsp;Fullscreen</span></button>

            <markdown class="preview-longtext" 
                     v-if="project.longtext"
                     :source="project.longtext" 
                     :postrender="tweakPreview"
                     :html="true" />

            <div v-if="project.autotext">
              <a :href="project.autotext_url" class="autotext-link">README</a>
              <markdown class="preview-autotext" 
                       :source="project.autotext" 
                       :postrender="tweakPreview"
                       :html="true" />
            </div>

            <div class="eventheader"
                v-if="false && eventData">
                <Header :event="eventData"></Header>
            </div>
          </div>

        </div>
        <div class="footer" slot="footer"
             @touchstart="touchStart">
          <button class="nav nav-prev" @click="goPrev(project)" title="Previous">◁</button>
          <button @click="selectNone()" title="Go back">▲</button>
          <button class="nav nav-next" @click="goNext(project)" title="Next">▷</button>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
import VueMarkdown from '@adapttive/vue-markdown'

import Modal from "./Modal"
import Header from "./Header"

// TODO: make this into an option / variable
const TIMER_LENGTH_MINUTES = parseInt(process.env.VUE_APP_TIMER_LENGTH) || 3;
const pc_per_tick = (TIMER_LENGTH_MINUTES > 0) ? 100 / (60 * TIMER_LENGTH_MINUTES) : 0;

export default {
  name: "Previews",
  components: {
    markdown: VueMarkdown,
    Modal, Header
  },
  props: {
    projects: Array,
    selected: Number,
    eventData: Object,
    withButtons: Boolean,
    withComments: Boolean,
    withChallenges: Boolean,
    showExcerpt: Boolean,
  },
  model: {
    prop: 'selected',
    event: 'setselected'
  },
  computed: {
    active: {
      get () { return this.selected },
      set (val) { this.$emit('setselected', val); }
    }
  },
  data: function() {
    return {
      fullscreen: false,
      ruigehond: 0,
    }
  },
  methods: {
    joinTeam: function (project) {
      window.open(project.url + "/star/me");
    },
    openComment: function (project) {
      window.open(project.url + "/comment");
    },
    contactTeam: function (project) {
      window.open(project.contact_url);
    },
    seeDetails: function (project_url) {
      window.open(project_url);
    },
    isEmbeddable: function (project) {
      return project.webpage_url && project.is_webembed;
    },
    getEmbed: function (project) {
      if (!project.webpage_url) return '';
      return project.webpage_url.endsWith('.pdf') ?
        project.url + '/render' : project.webpage_url;
    },
    seeEmbed: function (project) {
      window.open(project.webpage_url);
    },
    selectNone: function () {
      this.active = -1;
      this.fullscreen = false;
      this.$emit('close');
    },
    letsGo: function () {
      // Project navigation
      // This would be a less tacky option: https://swiperjs.com/vue
      let theProjects = this.projects;
      let curProjectId = this.active;
      let isChallenges = this.withChallenges;
      if (curProjectId === -1) return;
      let prev_item = -1, prev = null, next = null;
      theProjects.forEach(function(p) {
        if (!isChallenges && p.is_challenge) return;
        if (next) return;
        if (prev !== null) { next = p.id; }
        if (curProjectId == p.id) { prev = prev_item; }
        prev_item = p.id;
      });
      return { 'prev': prev, 'next': next }
    },
    goNext: function() { this.active = this.letsGo().next },
    goPrev: function() { this.active = this.letsGo().prev },
    touchStart (touchEvent) {
      if (touchEvent.changedTouches.length !== 1) { // one finger
        return;
      }
      const posXStart = touchEvent.changedTouches[0].clientX;
      addEventListener('touchend', (touchEvent) => this.touchEnd(touchEvent, posXStart), {once: true});
    },
    touchEnd (touchEvent, posXStart) {
      if (touchEvent.changedTouches.length !== 1) {
        return;
      }
      const SWIPE_LENGTH = 40;
      const posXEnd = touchEvent.changedTouches[0].clientX;
      if (SWIPE_LENGTH < posXEnd - posXStart) {
        this.goPrev(); // swipe right
      } else if (posXStart - posXEnd > SWIPE_LENGTH) {
        this.goNext(); // swipe left
      }
    },
    tweakPreview (content) {
      return content
      // Force all links in a new window
      //return content.replace(/href="/g,'target="_blank" href="');
    },
    toggleFullscreen () {
      this.fullscreen = !this.fullscreen;
      if (this.fullscreen) {
        this.ruigehond = 0;
        this.countDown();
        setTimeout(() => {
          document.getElementById('webembedframe').contentWindow.focus();
        }, 200);
      } else {
        this.ruigehond = 100;        
        document.getElementsByClassName('modal-container')[0].focus();
      }
    },
    countDown() {
      if (pc_per_tick == 0) return; // disabled
      if (this.ruigehond >= 100) { // completed
        this.ruigehond = 100; return;
      }
      this.ruigehond += pc_per_tick;
      let ths = this;
      setTimeout(() => { ths.countDown() }, 1000);
    }
  }
};
</script>

<style scoped>

div, p {
  font-family: "Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}

.name {
  margin-top: 0em;
  color: black;
  font-weight: bold;
  font-size: 2.5rem;
  line-height: 1.2;
  display: block;
  margin-bottom: 0.5em;
  text-decoration: none;
  text-align: left;
}
.summary {
  font-weight: bolder;
  text-align: left;
}
.hashtag {
  font-family: monospace;
  font-weight: bold;
  color: #999;
}
.teamroster {
  display: inline;
  float: right;
}
.teamroster span {
  margin: 0 0.4em;
  padding: 0 0.4em;
}
.teamroster span:before {
  content: '🏀 ';
}
.ident {
  font-weight: bold;
  font-size: 200%;
  color: red;
  float: right;
  text-align: left;
  text-shadow: 1px 1px 1px white;
  font-family: monospace;
  line-height: 0em;
  margin: 0.3em 0 0em 1em; 
  padding: 0px;
}

.eventheader {
  display: block;
  border-top: 4px solid #ccc;
  margin-top: 60px;
  padding-top: 60px;
  margin-bottom: 120px;
}

.imagepreview-floating {
  display: inline-block;
  position: fixed;
  z-index: 100;
  bottom: 3px; left: 3px;
  height: 120px;
  width: 120px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-repeat: no-repeat;
  background-color: white;
  background-size: cover;
  background-position: 0% 50%;
}

.imagepreview-overlay,
.imagepreview-underlay {
  display: block;
  width: 100%;
  height: 120px;
  margin-top: -18px;
  margin-bottom: 27px;
}
.imagepreview-underlay {
  filter: saturate(0%) contrast(0.2) brightness(0.4);
  z-index: -1;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;
  margin-left: -10%;
  position: fixed;
  z-index: 99;
}
.imagepreview-overlay {
  position: fixed;
  z-index: 100;
  background-repeat: no-repeat;
  background-color: transparent;
  background-size: contain;
  background-position: 0% 50%;
}

.preview {
  text-align: left;
  color: black;
  line-height: 140%;
  margin-bottom: 2em;
  padding-bottom: 4em;
}

.autotext-link {
  display: block;
  background: gainsboro;
  color: blue;
  font-weight: bold;
  font-family: monospace;
  font-size: 200%;
  padding: 1em;
  text-align: center;
}

.phase {
  margin: 0em 1em;
  opacity: 0.5;
}

.modal-footer button {
  opacity: 0.9;
  transition: all 0.3s ease;
  border: none;
}
.modal-footer:hover button {
  opacity: 1;
}
button.nav-next {
  float: right;
}
button.nav-prev {
  float: left;
}
.dark .footer button {
  background: black; color: white;
}
.status button {
  margin: 0 0.5em 0 0;
  font-size: 80%;
}
.status {
  font-family: monospace;
  font-weight: normal;
  font-size: 125%;
  margin-top: 1em;
  margin-bottom: 3em;
  padding: 5px 7px;
  background: white;
  width: 100%;
  text-align: center;
}

.dark .status {
  background: black;
  color: white;
}

.frame-container iframe {
  width: 100% !important;
  height: 100% !important;
  border: none !important;
}
.frame-container {
  width: 100%;
  height: 600px;
  box-shadow: 5px 5px 10px #535353;
  margin-bottom: 1em;
  border: 1px silver;
  border-radius: 4px;
  overflow: hidden;
  position: sticky;
}

.webembed {
  width: 400px;
  height: 240px;
  max-width: 100%;
  border: 1px solid silver;
  box-shadow: 5px 5px 10px #cce;
  padding: 0px;
  margin: 0px;
}

.go-fullscreen {
  font-size: 1em;
  margin-top: -0.5em;
}
@media (min-width: 768px) {
  .go-fullscreen {
    margin-left: -3em;
    margin-top: 0em;
    float: left;
    box-shadow: none;
  }
  .go-fullscreen span { font-size: 0px; }
}
.dark .webembed-fullscreen {
  background: black;
}
.webembed-fullscreen {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  background: white;
  z-index: 9998;
}
.webembed-fullscreen button {
  bottom: 0px;
  right: 0px;
  position: absolute;
  z-index: 9999;
  box-shadow: none;
  font-size: 1em;
  margin: 0px;
  padding: 0px 0.6em;
  border: 1px solid grey;
  background: white; color: black;
}
.dark .webembed-fullscreen button {
  background: black; color: white;
}
.webembed-fullscreen iframe {
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  position: absolute;
  border: 0px;
  padding: 0px;
  margin: 0px;
}

@media (min-width: 768px) {
  .preview {
    margin-left: 10%;
    margin-right: 10%;
  }

  .status {
    width: auto;
    position: fixed;
    bottom: 0px;
    left: 50%;
    margin-left: -20em;
    margin-bottom: 0em;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    border-bottom: none;
  }
}

/* Shaggy dog style progress bar */
#ruigehond {
    z-index: 9998;
    position: fixed;
    display: block;
    left: 0;
    bottom: 0px;
    width: 100%;
    height: 10px;
    margin: 0;
    overflow: visible;
    background-color: rgb(0,0,0);
}
#ruigehond.finished {
    animation-name: pulsate;
    animation-duration: 2s;
    animation-iteration-count: infinite;
    animation-direction: alternate-reverse;
    animation-timing-function: ease;
}
@keyframes pulsate {
  from {background-color: rgb(255,0,0);}
  to {background-color: rgb(0,0,0);}
}
#ruigehond.finished > div {
    display: none;
}
#ruigehond > div {
    display: block;
    background: linear-gradient(to right, #0E91F8, #e42fe2);
    border-right: 1px solid gray;
    width: 0px;
    height: 100%;
}

</style>
