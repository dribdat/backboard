<template>
  <div container class="section-dribs">
    <div v-for="drib in activities" :key="drib.id">
      <div class="drib" v-if="drib.content">
        <markdown class="drib-content" :source="drib.content" :html="true" />
        <div class="drib-meta">
          <span class="drib-since" :title="drib.date">
            {{ drib.timesince }}
          </span>
          <span class="drib-who" v-if="drib.user_name">
            {{ drib.user_name }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProjectDribs",
  props: {
    activities: Array,
  },
};
</script>

<style scoped>
/* -- Dribs -- */

.section-dribs {
  margin-bottom: 4em;
}

.drib {
  margin: 2em 20%;
  padding: 0em 1em;
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  background: rgba(230, 230, 230);
  box-shadow: 5px 5px 0px rgba(0, 0, 0, 0.2);
  font-size: 90%;
  line-height: 140%;
  text-align: left;
  overflow: hidden;
}

.drib-meta {
  color: grey;
  text-align: center;
  font-size: 80%;
  margin-top: -1.5em;
  margin-bottom: 0.2em;
}

.drib-since {
  font-style: monospace;
  margin-right: 1em;
}

.drib-who:before {
  content: "🏀 ";
  font-size: 50%;
  white-space: nowrap;
  vertical-align: super;
}

@media (max-width: 700px) {
  .event-details {
    margin: 1em;
  }
}
</style>