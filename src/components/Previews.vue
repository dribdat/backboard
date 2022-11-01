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
             >{{ project.name }}</div>
        <div class="content" slot="body">
          <markdown class="preview" :source="project.longtext || project.excerpt" :html="true" />
        </div>
        <div class="footer" slot="footer"
             @touchstart="touchStart">
          <button class="nav nav-prev" @click="goPrev(project)" title="Previous">&lt;--</button>
          <button @click="seeDetails(project)"><b>Details</b> ...</button>
          <button @click="openComment(project)">💬</button>
          <button class="nav nav-next" @click="goNext(project)" title="Next">--&gt;</button>
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
      window.open(project.url + "/post");
    },
    contactTeam: function (project) {
      window.open(project.contact_url);
    },
    seeDetails: function (project) {
      window.open(project.url);
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

.preview {
  text-align: left;
  color: black;
  line-height: 140%;
}

button.nav-next {
  float: right;
}
button.nav-prev {
  float: left;
}

</style>
