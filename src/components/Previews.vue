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

            <div class="eventheader"
                v-if="eventData">
                <Header :event="eventData"></Header>
              </div>

            <a class="imagepreview"
                title="Open image"
                v-if="project.image_url && eventData && project.image_url !== eventData.logo_url"
                :href="project.image_url" target="_blank"
                :style="'background-image:url(' + project.image_url + ')'"></a>

            <div class="name">{{ project.name }}</div>

            <div class="ident">{{ project.ident }}</div>
            <div class="hashtag">{{ project.hashtag }}</div>

            <div v-show="project.summary" class="summary">
              <p>{{ project.summary }}</p>
            </div>


        </div>
        <div class="content" slot="body">

          <div class="preview" v-if="showExcerpt">

            <markdown class="excerpt" 
                     v-if="!project.is_webembed && !project.longtext && project.excerpt"
                     :source="project.excerpt" 
                     :postrender="tweakPreview"
                     :html="true" />

            <iframe class="webembed"
                    v-if="project.is_webembed"
                    :src="project.webpage_url"></iframe>

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

          </div>

          <div class="status">
            <span class="nowrap">
              <span class="phase">{{ project.phase }}</span>
              <button title="Open project page" 
                     @click="seeDetails(project)"
                     :href="project.url">
                     📖 Open
              </button>
              <button v-if="project.webpage_url"
                      title="Open project slides or demo link" 
                     @click="seeEmbed(project)">
                     🖼️ Presentation 
              </button>
              <button v-if="withComments" 
                      @click="openComment(project)" 
                      title="Write a comment to the team">
                     💬 Comment
              </button>  

            </span>
          </div>

        </div>
        <div class="footer" slot="footer"
             @touchstart="touchStart">
          <button class="nav nav-prev" @click="goPrev(project)" title="Previous">⬅️</button>
          <button @click="seeDetails(project)" title="Details ...">ℹ️</button>
          <button class="nav nav-next" @click="goNext(project)" title="Next">➡️</button>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
import VueMarkdown from '@adapttive/vue-markdown'

import Modal from "./Modal"
import Header from "./Header"

export default {
  name: "Previews",
  components: {
    markdown: VueMarkdown,
    Modal, Header
  },
  props: {
    projects: Array,
    selected: Number,
    withComments: Boolean,
    withChallenges: Boolean,
    showExcerpt: Boolean,
    eventData: Object
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
      if (project.webpage_url.lastIndexOf('.pdf') == project.webpage_url.length - 4) {
        window.open(project.url + '/render');
      } else {
        window.open(project.webpage_url);
      }
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
  color: darkgray;
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
  margin-top: 0px;
  margin-bottom: 60px;
}
.imagepreview {
  display: block;
  width: 100%;
  height: 120px;
  margin-top: -18px;
  margin-bottom: 27px;
  background-repeat: no-repeat;
  background-color: transparent;
  background-size: cover;
  background-position: 50% 50%;
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
  width: 100%;
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
  margin: 0 0.8em 0 0;
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
  width: 100%;
  height: 500px;
  border: 1px solid silver;
  box-shadow: 5px 5px 10px #535353;
  padding: 0px;
  margin: 0px;
}

@media (min-width: 768px) {
  .preview {
    margin-left: 10%;
    margin-right: 10%;
  }

  .status {
    position: fixed;
    bottom: 0px;
    left: 50%;
    margin-left: -13em;
    margin-bottom: 0em;
    border: 1px solid #ddd;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    border-bottom: none;
  }
}

</style>
