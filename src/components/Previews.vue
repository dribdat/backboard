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
             >
            <div class="name">{{ project.name }}</div>

            <div v-show="project.summary" class="summary">
              <p>{{ project.summary }}</p>
            </div>

            <div class="imagepreview"
              v-if="project.image_url"
              :style="'background-image:url(' + project.image_url + ')'"></div>
        </div>
        <div class="content" slot="body">
          <markdown class="preview" :source="project.longtext || project.excerpt" :html="true" />

          <div class="status">
            <span class="phase">{{ project.phase }}</span>
            /
            <span class="date">{{ project.date }}</span>
          </div>
        </div>
        <div class="footer" slot="footer"
             @touchstart="touchStart">
          <button class="nav nav-prev" @click="goPrev(project)" title="Previous">⬅️</button>
          <button @click="seeDetails(project)" title="Details ...">ℹ️</button>
          <button v-if="project.is_webembed" @click="seeEmbed(project)" title="Embedded">👁️👃🏻👁️</button>
          <button @click="openComment(project)" title="Comment">💬</button>  
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
    }
  }
};
</script>

<style scoped>

.summary {
  font-weight: bolder;
}

.imagepreview {
  width: 100%;
  height: 100px;
  background-repeat: no-repeat;
  background-color: #666;
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
  opacity: 0.3;
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

.status {
  font-family: monospace;
  font-weight: normal;
}
.name {
  margin-top: 0em;
  color: #0089c7;
  font-weight: bold;
  font-size: 150%;
  display: block;
  margin-bottom: 0.5em;
  text-decoration: none;
}

</style>
