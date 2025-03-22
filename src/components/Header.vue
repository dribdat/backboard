<template>
  <div class="section-header">
    <div class="header-logo" v-if="event.logo_url">
      <a :href="event.webpage" :title="event.name" target="_blank">
        <img id="event-logo" :src="event.logo_url">
      </a>
    </div>
    <div class="header-content">
      <h3 class="event-name">{{ event.name }}</h3>
      <span class="event-hostname" v-if="event.hostname">
        <i class="fa fa-bank">🏢</i>
        {{ event.hostname }}</span>
      <span class="event-location" v-if="event.location">
        <i class="fa fa-map">🗺️</i>
        {{ event.location }}</span>
      <p class="header-summary" v-if="event.summary">
        {{ event.summary }}
      </p>
      <a :href="event.webpage" target="_blank" v-if="event.webpage" class="btn">
        🌐
      </a>
      <a :href="event.community_url" target="_blank" v-if="event.community_url" class="btn">
        🗨️
      </a>
      <a :href="event.webpage_url" target="_blank" v-if="event.webpage_url" class="btn">
        🎫
      </a>
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

.header-logo {
  display: block;
  float: none;
  margin: none;
}

.header-logo img {
  height: 6em;
  margin-bottom: 3em;
}

.header-logo {
  display: inline-block;
  float: left;
  margin-right: 2em;
}

@media (max-width: 768px) {
  #event-logo {
    max-width: 128px;
    max-height: 128px;
    margin-bottom: 1em;
  }
  .header-logo {
    display: block;
    float: none;
    margin: none;
  }
  .header-logo img {
    width: 100%;
    height: auto;
  }
  .header-content {
    padding-bottom: 2em;
  }
  .event-location {
    display: block;
  }
}

.event-name {
  font-weight: normal;
  font-size: 250%;
  margin: 0px;
  text-align: left;
  line-height: 1.2em;
  margin-bottom: 1pt;
  padding-bottom: 0.2em;
}

.header-content {
  text-align: left;
}
.header-content span {
  margin-right: 1em;
  opacity: 0.7;
}

.header-content .btn {
  text-decoration: none;
  box-shadow: none;
}

.header-summary {
  font-size: 90%;
  font-style: italic;
  text-align: left;
  margin-top: 0.5em;
  opacity: 0.7;
}
</style>
