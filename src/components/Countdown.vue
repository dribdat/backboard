<template>
  <div class="section-countdown" :title="timespan" v-if="deadline">
    <vue3-flip-countdown :deadline="deadline" mainColor="#FFFFFF" secondFlipColor="#EEEEEE" />
  </div>
</template>

<script>
import { ref } from "vue"
import { Countdown } from 'vue3-flip-countdown'


export default {
  name: "EventCountdown",
  components: {
    "vue3-flip-countdown": Countdown,
  },
  props: {
    event: {
      required: true,
    }
  },
  setup(props) {
    let timespan = ref("");
    let deadline = ref("2000-01-01 12:00");
    return {
      timespan,
      deadline,
    };
  },
  mounted() {
    setTimeout(() => {
      const evt = this.event;
      if (!evt) return;
      console.log(evt);
      this.deadline =
        (!evt.has_started &&
          evt.starts_at
          ? evt.starts_at.replace("T", " ")
          : null
        ) || (!evt.has_finished &&
          evt.ends_at
          ? evt.ends_at.replace("T", " ")
          : null
        );
      this.timespan = evt.starts_at && evt.ends_at
        ? evt.starts_at + " → " + evt.ends_at
        : "";
    }, 500);
  }
};
</script>
