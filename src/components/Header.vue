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
      <span class="event-hostname" v-if="false && event.hostname">
        <i class="fa fa-bank">🏢</i>
        {{ event.hostname }}</span>
      <span class="event-location" v-if="false && event.location">
        <i class="fa fa-map">🗺️</i>
        {{ event.location }}</span>
      <div class="event-date" v-if="false && event.date">
        <i class="fa fa-calendar">📆</i>
        {{ event.date }}</div>
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

.header-logo img {
  width: 100px;
  height: auto;
  margin-bottom: 10px;
}

.header-logo {
  float: left;
  margin-right: 1em;
}

.event-name {
  color: black;
  font-size: 200%;
  margin: 0px;
  text-align: left;
  margin-left: 15%;
}

.header-summary {
  font-size: 90%;
  font-style: italic;
  text-align: left;
  max-width: 80%;
  margin-left: 15%;
}
</style>