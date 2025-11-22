<template>
  <div class="section-countdown" :title="timespan">
    <vue3-flip-countdown v-if="deadline" :deadline="deadline" />
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import Vue3FlipCountdown from "vue3-flip-countdown";

export default {
  name: "EventCountdown",
  props: {
    event: {
      required: true,
    },
  },
  components: {
    "vue3-flip-countdown": Vue3FlipCountdown,
  },
  setup(props) {
    const timespan = ref("");
    const deadline = ref("2000-01-01 12:00");

    onMounted(() => {
      setTimeout(() => {
        deadline.value =
          !props.event.has_started && props.event.starts_at
            ? props.event.starts_at.replace("T", " ")
            : props.event.ends_at
            ? props.event.ends_at.replace("T", " ")
            : null;
        timespan.value = props.event.starts_at
          ? props.event.starts_at + " → " + props.event.ends_at
          : "";
      }, 1000);
    });

    return {
      timespan,
      deadline,
    };
  },
};
</script>