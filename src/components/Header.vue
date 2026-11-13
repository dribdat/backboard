<template>
  <div class="section-header">
    <div class="header-logo" v-if="event.logo_url">
      <a :href="event.webpage" :title="event.name" target="_blank">
        <img alt="Logo" :src="event.logo_url" />
      </a>
    </div>
    <div class="header-content">
      <a
        :href="event.webpage_url"
        target="_blank"
        title="Home page"
        v-if="event.webpage_url"
        class="btn"
      >
        🌐
      </a>
      <a
        :href="event.community_url"
        target="_blank"
        title="Community link"
        v-if="event.community_url"
        class="btn"
      >
        🗨️
      </a>
      <h3 class="event-name">{{ event.name }}</h3>
      <span class="event-hostname" v-if="event.hostname">
        <i class="fa fa-bank">🏢</i>
        {{ event.hostname }}</span
      >
      <span class="event-location" v-if="event.location">
        <i class="fa fa-map">🗺️</i>
        {{ event.location }}</span
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "EventHeader",
  props: {
    event: Object,
  },
};
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
  display: inline-block;
  float: left;
  max-width: 14em;
  min-height: 6em;
  margin-right: 2em;
  margin-bottom: 1em;
}
.header-logo img {
  width: 100%;
  height: auto;
}

@media (max-width: 768px) {
  .header-logo {
    display: block;
    float: none;
    margin: 0px;
    max-width: none;
    max-height: none;
  }
  .header-logo a {
    display: inline-block;
    max-height: 128px;
    margin-bottom: 1em;
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
  float: right;
}
</style>
