<template>
  <div class="section-header">
    <div class="header-logo" v-if="event.logo_url">
      <a :href="event.webpage" :title="event.name">
        <img id="event-logo" :src="event.logo_url">
      </a>
    </div>
    <div class="header-content" v-if="false">
      <a :href="event.webpage">
        <h3 class="event-name">{{ event.name }}</h3>
      </a>
      <div class="event-hostname" v-if="event.hostname">
        <i class="fa fa-bank">🏢</i>
        {{ event.hostname }}</div>
      <div class="event-date" v-if="event.date">
        <i class="fa fa-calendar">📆</i>
        {{ event.date }}</div>
      <div class="event-location" v-if="event.location">
        <i class="fa fa-map">🗺️</i>
        {{ event.location }}</div>
    </div>
    <p class="header-summary" v-if="event.summary">
      {{ event.summary }}
    </p>
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
  max-width: 100%;
  max-height: 200px;
}

</style>