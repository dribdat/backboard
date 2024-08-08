<template>
  <div class="section-countdown"
      :title="timespan">

    <countdown :deadline="deadline" />
  </div>
</template>

<script>
import FlipCountdown from 'vue2-flip-countdown'

export default {
  name: "Countdown",
  props: {
    event: {
      required: true
    }
  },
  components: {
    countdown: FlipCountdown 
  },
  data() {
    return {
      timespan: '',
      deadline: '2000-01-01 12:00'
    }
  },
  created() {
    const self = this;
    setTimeout(() => {
      this.deadline = (!this.event.has_started && this.event.starts_at) ?
                  this.event.starts_at.replace('T', ' ') :
                  (this.event.ends_at) ?
                    this.event.ends_at.replace('T', ' ') : null;
      this.timespan = (this.event.starts_at) ? 
                  this.event.starts_at + ' → ' + this.event.ends_at : '';
    }, 1000)
  }
}
</script>
