<template>
  <div class="section-footer">

    <div container v-if="event.description" class="event-details">
      <markdown class="description col" 
         :source="event.description" 
         :html="true" />
    </div>
    
  </div>
</template>

<script>
import VueMarkdown from '@adapttive/vue-markdown'

export default {
  name: "Footer",
  props: {
    event: {
      required: true
    }
  },
  components: {
    markdown: VueMarkdown,
  }
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

@media(max-width: 700px) {
  .event-details {
    margin: 1em;
  }
}

</style>
