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
            :style="project.logo_color ? ('border-bottom: 3px solid ' + project.logo_color) : ''"
             >
            <div class="hashtag">{{ project.hashtag }}</div>

            <div class="imagepreview"
                v-if="project.image_url"
                :style="'background-image:url(' + project.image_url + ')'"></div>

            <div class="name">{{ project.name }}</div>

            <div v-show="project.summary" class="summary">
              <p>{{ project.summary }}</p>
            </div>

        </div>
        <div class="content" slot="body">
  
          <!-- WIP
            <div class="project-webembed">
              <div class="frame-container">
                <iframe :src="project.webpage"></iframe>
              </div>
            </div>
          -->

          <markdown class="preview" 
                   :source="project.longtext || project.excerpt" 
                   :postrender="tweakPreview"
                   :html="true" />

          <div class="status">
            <span class="phase">{{ project.phase }}</span>
            /
            <span class="date">{{ project.date }}</span>
            <span class="nowrap">
              <button title="Open project page" 
                     @click="seeDetails(project)"
                     :href="project.url">
                     📖 Open
              </button><button v-if="project.webpage_url"
                      title="Open project slides or demo link" 
                     @click="seeEmbed(project)">
                     🔍 Demo
              </button>
            </span>
          </div>

        </div>
        <div class="footer" slot="footer"
             @touchstart="touchStart">
          <button class="nav nav-prev" @click="goPrev(project)" title="Previous">⬅️</button>
          <button @click="seeDetails(project)" title="Details ...">ℹ️</button>
          <button v-if="withComments" @click="openComment(project)" title="Comment">💬</button>  
          <button class="nav nav-next" @click="goNext(project)" title="Next">➡️</button>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
import VueMarkdown from '@adapttive/vue-markdown'

import Modal from "./Modal"

export default {
  name: "Previews",
  components: {
    markdown: VueMarkdown,
    Modal,
  },
  props: {
    projects: Array,
    selected: Number,
    withComments: Boolean,
    withChallenges: Boolean
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
  methods: {
    openComment: function (project) {
      window.open(project.url + "/comment");
    },
    contactTeam: function (project) {
      window.open(project.contact_url);
    },
    seeDetails: function (project) {
      window.open(project.url);
    },
    seeEmbed: function (project) {
      window.open(project.webpage_url);
    },
    selectNone: function () {
      this.active = -1;
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
      return content.replace(/href="/g,'target="_blank" href="');
    }
  }
};
</script>

<style scoped>

.name {
  margin-top: 0em;
  color: black;
  font-weight: bold;
  font-size: 200%;
  display: block;
  margin-bottom: 0.5em;
  text-decoration: none;
}
.summary {
  font-weight: bolder;
}
.hashtag {
  float: left;
  font-weight: bold;
  font-size: 120%;
  color: red;
  text-shadow: 1px 1px 1px white;
  font-family: monospace;
  line-height: 0em;
  margin: 0.8em 0 0; 
  padding: 0px;
}

.imagepreview {
  width: 100%;
  height: 120px;
  margin-top: -18px;
  margin-bottom: 27px;
  background-repeat: no-repeat;
  background-color: transparent;
  background-size: contain;
  background-position: 50% 50%;
}

.preview {
  text-align: left;
  color: black;
  line-height: 140%;
}
@media (min-width: 768px) {
  .preview {
    margin: 0px 20%;
  }
}

.content img,
.preview img {
  max-width: 100% !important;
}

.modal-footer button {
  opacity: 0.9;
  transition: all 0.3s ease;
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

.nowrap {
  white-space: nowrap;
}

.status button {
  margin: 0 0 0 0.5em;
  font-size: 80%;
}

.status {
  font-family: monospace;
  font-weight: normal;
  font-size: 125%;
  margin-top: 1em;
  padding: 5px 7px;
  background: white;
}
@media (min-width: 768px) {
  .status {
    position: fixed;
    bottom: 0px;
    left: 50%;
    margin-left: -13em;
    border: 1px solid #ddd;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    border-bottom: none;
  }
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

/*
.modal-container:before {
  position: absolute;
  content: '';
}
.modal-container:before {
  top: 4px; 
  left: 4px;
  height: calc(100% - 8px); 
  width: calc(100% - 8px); 
  background: #6c6;
}
.modal-container, .modal-container:before, .modal-container:after {
  -webkit-clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
}
*/

</style>
