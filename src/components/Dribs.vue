<template>
  <div container class="section-dribs">
    <h1>Dribs</h1>

    <div v-for="drib in activities" :key="drib.id" class="drib">
      <markdown class="drib-content"
                v-if="drib.content"
         :source="drib.content"
         :html="true" />
    </div>

  </div>
</template>

<script>
import VueMarkdown from '@adapttive/vue-markdown'

export default {
  name: "Dribs",
  props: {
    activities: Array
  },
  components: {
    markdown: VueMarkdown,
  }
}
</script>

<style scoped>
/* -- Footer -- */

.drib {
  margin: 2em 20%;
  padding: 0.5em 1em;
  border: 1px solid rgba(0,0,0,0.3);
  border-radius: 6px;
  background: rgba(230, 230, 230);
  box-shadow: 5px 5px 0px rgba(0,0,0,0.2);
  font-size: 90%;
  line-height: 140%;
  text-align: left;
  overflow: hidden;
}

@media(max-width: 700px) {
  .event-details {
    margin: 1em;
  }
}

</style>
