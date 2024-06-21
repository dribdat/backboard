<template>
  <div class="section-footer"
      :title="timespan">

    <countdown :deadline="deadline" v-if="isCountdown" />

    <div container v-if="event.description" class="event-details">
      <markdown class="description col" 
         :source="event.description" 
         :html="true" />
    </div>
  </div>
</template>

<script>
import FlipCountdown from 'vue2-flip-countdown'
import VueMarkdown from '@adapttive/vue-markdown'

export default {
  name: "Footer",
  props: {
    event: {
      required: true
    },
    isCountdown: Boolean
  },
  components: {
    markdown: VueMarkdown,
    countdown: FlipCountdown 
  },
  data() {
    return {
      timespan: '',
      deadline: '2000-01-01 12:00'
    }
  },
  mounted() {
    this.deadline = (!this.event.has_started && this.event.starts_at) ?
                 this.event.starts_at.replace('T', ' ') :
                 (this.event.ends_at) ?
                  this.event.ends_at.replace('T', ' ') : null;
    this.timespan = (this.event.starts_at) ? 
                 this.event.starts_at + ' → ' + this.event.ends_at : '';
  },
}
</script>

<style scoped>
/* -- Footer -- */

.dark .section-footer {
  color: white;
}
.section-footer {
  color: black;
}

.dark .event-details {
  background: #333;
  color: white;
}

.event-details {
  margin: 2em 20%;
  position: relative;
  padding: 0.5em 1em;
  border: 1px solid rgba(0,0,0,0.3);
  border-radius: 6px;
  background: #fafafa;
  box-shadow: 5px 5px 0px rgba(0,0,0,0.3);
  font-size: 90%;
  text-align: left;
  overflow: hidden;
}

.event-details img, .event-details iframe {
  max-width: 100%;
}

@media(max-width: 700px) {
  .event-details {
    margin: 1em;
  }
}

</style>
