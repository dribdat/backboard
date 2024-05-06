<template>
  <div class="section-header">
    <div class="header-logo" v-if="event.logo_url">
      <a :href="event.webpage" :title="event.name" target="_blank">
        <img id="event-logo" :src="event.logo_url">
      </a>
    </div>
    <div class="header-content">
      <a :href="event.webpage" target="_blank">
        <h3 class="event-name">{{ event.name }}</h3>
      </a>
      <span class="event-hostname" v-if="event.hostname">
        <i class="fa fa-bank">🏢</i>
        {{ event.hostname }}</span>
      <span class="event-location" v-if="event.location">
        <i class="fa fa-map">🗺️</i>
        {{ event.location }}</span>
      <p class="header-summary" v-if="event.summary">
        {{ event.summary }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Header",
  props: {
    event: Object
  }
}
</script>

<style scoped>
/* -- Headline -- */

.dark .section-header {
  color: white;
}
.section-header {
  color: black;
}


.header-logo img {
  height: 6em;
  margin-bottom: 2em;
}

.header-logo {
  display: inline-block;
  float: left;
  margin-right: 1em;
}

@media (max-width: 768px) {
  .header-logo {
    display: block;
    float: none;
    margin: none;
  }
}

.event-name {
  font-size: 250%;
  margin: 0px;
  text-align: left;
  line-height: 1.4em;
  margin-bottom: 1pt;
}

.header-content {
  text-align: left;
}
.header-content span {
  margin-right: 1em;
  opacity: 0.7;
}

.header-summary {
  font-size: 90%;
  font-style: italic;
  text-align: left;
  margin-top: 0.5em;
  opacity: 0.7;
}
</style>