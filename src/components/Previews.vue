<template>
  <div>
    <div v-for="project in projects" :key="project.id">
      <div v-if="active == project.id" class="modal-backdrop">
        <div class="modal">
          <div class="modal-header">
            <button @click="selectNone()" class="modal-close-button">
              &times;
            </button>
          </div>
          <div class="modal-body">
            <div
              class="titlebar"
              @touchstart="touchStart"
              title="Swipe here or tap below to advance"
              :style="
                'border-color:' +
                (project.logo_color ? project.logo_color : '#ccc')
              "
            >
              <div class="imagepreview" v-if="project.image_url">
                <a
                  class="imagepreview-floating"
                  title="Open image"
                  :href="project.image_url"
                  target="_blank"
                  :style="'background-image:url(' + project.image_url + ')'"
                ></a>
              </div>

              <div class="name">{{ project.name }}</div>

              <div class="summary">
                <p v-show="project.summary">{{ project.summary }}</p>
              </div>

              <div class="ident">{{ project.ident }}</div>
              <div class="hashtag">{{ project.hashtag }}</div>
              <div class="teamroster">
                <div v-for="person in project.team" :key="person">
                  <a
                    v-show="person"
                    class="person"
                    @click="seePerson(person)"
                    >{{ person }}</a
                  >
                </div>
              </div>

              <div class="status">
                <button
                  title="Open project page"
                  @click="seeDetails(project.url)"
                >
                  ◳ {{ project.phase }}
                </button>
                <button
                  v-if="isEmbeddable(project)"
                  title="Open in a new window"
                  @click="seeEmbed(project)"
                >
                  ⟁ View
                </button>
                <button
                  v-if="project.download_url"
                  title="Open demo or download link"
                  @click="seeDetails(project.download_url)"
                >
                  ⧨ Demo
                </button>

                <button
                  v-if="withButtons"
                  @click="joinTeam(project)"
                  title="Join this team"
                >
                  🏀 Join
                </button>

                <button
                  v-if="withComments"
                  @click="openComment(project)"
                  title="Write a comment to the team"
                >
                  🗨️ Comment
                </button>

                <button
                  v-if="withButtons"
                  v-show="project.contact_url"
                  @click="contactTeam(project)"
                  title="Open the contact page"
                >
                  👋 Contact
                </button>
              </div>
            </div>
            <div class="content">
              <div class="preview">
                <markdown
                  class="excerpt"
                  v-if="
                    !project.longtext &&
                    project.excerpt &&
                    !(showExcerpt && isEmbeddable(project))
                  "
                  :source="project.excerpt"
                  :html="true"
                />

                <iframe
                  class="webembed"
                  v-if="showExcerpt && isEmbeddable(project)"
                  :src="getEmbed(project)"
                ></iframe>

                <div
                  class="webembed-fullscreen"
                  v-if="showExcerpt && isEmbeddable(project) && fullscreen"
                >
                  <div
                    id="ruigehond"
                    :class="'' + ruigehond < 100 ? '' : 'finished'"
                  >
                    <div
                      role="progressbar"
                      aria-valuemin="0"
                      aria-valuemax="100"
                      tabindex="-1"
                      title="Time remaining"
                      :style="
                        'width:' +
                        ruigehond +
                        '%;background:rgb(' +
                        ruigehond * 2 +
                        ',0,0);'
                      "
                      :aria-valuenow="ruigehond"
                    ></div>
                  </div>

                  <div class="fullscreen-controls">
                    <button
                      v-if="project.download_url"
                      class="fullscreen-demo-button"
                      title="Open demo or download link"
                      @click="seeDetails(project.download_url)"
                    >
                      Demo
                    </button>
                    <button
                      @click="toggleNextproject()"
                      class="fullscreen-next-button"
                      title="Next project"
                    >
                      ▷
                    </button>
                    <button
                      @click="toggleFullscreen()"
                      class="fullscreen-close-button"
                      title="Close fullscreen"
                    >
                      ⨱
                    </button>
                  </div>
                  <iframe
                    class="webembed"
                    id="webembedframe"
                    :src="getEmbed(project)"
                  ></iframe>
                </div>
                <button
                  v-if="showExcerpt && isEmbeddable(project)"
                  class="go-fullscreen"
                  @click="toggleFullscreen()"
                  title="Open in full screen mode - tap ⬡ to close again"
                >
                  &#x26F6;<span>&nbsp;Zoom</span>
                </button>

                <div class="autotext-nav">
                  <span v-if="project.autotext">
                    <a href="#readme">README</a>
                  </span>
                  <span v-if="project.activities">
                    <a href="#dribs">DRIBS</a>
                  </span>
                </div>

                <div v-if="project.longtext">
                  <a class="autotext-link" name="pitch" href="#pitch">PITCH</a>
                  <markdown
                    class="preview-longtext"
                    v-if="project.longtext"
                    :source="project.longtext"
                    :html="true"
                  />
                </div>

                <div v-if="project.autotext">
                  <a class="autotext-link" name="readme" href="#pitch"
                    >README</a
                  >
                  <a
                    class="autotext-open"
                    target="_blank"
                    :href="project.autotext_url"
                    >Open original ...</a
                  >
                  <markdown
                    class="preview-autotext"
                    :source="project.autotext"
                    :html="true"
                  />
                </div>

                <div v-if="project.activities">
                  <a class="autotext-link" name="dribs" href="#pitch">DRIBS</a>
                  <Dribs :activities="project.activities" />
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer" @touchstart="touchStart">
            <button class="nav nav-prev" @click="goPrev()" title="Previous">
              ◁
            </button>
            <button @click="selectNone()" title="Go back">▲</button>
            <button class="nav nav-next" @click="goNext()" title="Next">
              ▷
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import Dribs from "./Dribs.vue";

export default {
  name: "ProjectPreviews",
  components: {
    Dribs,
  },
  props: {
    projects: Array,
    modelValue: Number,
    profileUrl: String,
    eventData: Object,
    activityData: Object,
    withButtons: Boolean,
    withComments: Boolean,
    withChallenges: Boolean,
    showExcerpt: Boolean,
  },
  emits: ["update:modelValue", "close"],
  setup(props, { emit }) {
    const fullscreen = ref(false);
    const ruigehond = ref(0);

    const active = computed({
      get() {
        return props.modelValue;
      },
      set(val) {
        emit("update:modelValue", val);
      },
    });

    const joinTeam = (project) => {
      window.open(project.url + "/star/me");
    };

    const openComment = (project) => {
      window.open(project.url + "/comment");
    };

    const contactTeam = (project) => {
      window.open(project.contact_url);
    };

    const seeDetails = (project_url) => {
      window.open(project_url);
    };

    const seePerson = (person) => {
      if (!props.profileUrl) return;
      const userhref = props.profileUrl + person;
      window.open(userhref);
    };

    const isWithslides = (project) => {
      return (
        project.is_webembed &&
        (project.longtext.indexOf("\n---") > 0 ||
          project.longtext.indexOf("\n***") > 0)
      );
    };

    const isEmbeddable = (project) => {
      return project.webpage_url || isWithslides(project);
    };

    const getEmbed = (project) => {
      if (isWithslides(project)) return project.url + "/render";
      if (!project.webpage_url) return "";
      return project.webpage_url.endsWith(".pdf")
        ? project.url + "/render"
        : project.webpage_url;
    };

    const seeEmbed = (project) => {
      window.open(project.webpage_url);
    };

    const selectNone = () => {
      active.value = -1;
      fullscreen.value = false;
      emit("close");
    };

    const letsGo = () => {
      let theProjects = props.projects;
      let curProjectId = active.value;
      let isChallenges = props.withChallenges;
      if (curProjectId === -1) return;
      let prev_item = -1,
        prev = null,
        next = null;
      theProjects.forEach(function (p) {
        if (!isChallenges && p.is_challenge) return;
        if (next) return;
        if (prev !== null) {
          next = p.id;
        }
        if (curProjectId == p.id) {
          prev = prev_item;
        }
        prev_item = p.id;
      });
      return { prev: prev, next: next };
    };

    const goNext = () => {
      active.value = letsGo().next;
    };

    const goPrev = () => {
      active.value = letsGo().prev;
    };

    const touchStart = (touchEvent) => {
      if (touchEvent.changedTouches.length !== 1) {
        return;
      }
      const posXStart = touchEvent.changedTouches[0].clientX;
      addEventListener(
        "touchend",
        (touchEvent) => touchEnd(touchEvent, posXStart),
        { once: true }
      );
    };

    const touchEnd = (touchEvent, posXStart) => {
      if (touchEvent.changedTouches.length !== 1) {
        return;
      }
      const SWIPE_LENGTH = 40;
      const posXEnd = touchEvent.changedTouches[0].clientX;
      if (SWIPE_LENGTH < posXEnd - posXStart) {
        goPrev();
      } else if (posXStart - posXEnd > SWIPE_LENGTH) {
        goNext();
      }
    };

    const toggleFullscreen = () => {
      fullscreen.value = !fullscreen.value;
      if (fullscreen.value) {
        ruigehond.value = 0;
        countDown();
        setTimeout(() => {
          document.getElementById("webembedframe").contentWindow.focus();
        }, 200);
      } else {
        ruigehond.value = 100;
        document.getElementsByClassName("modal")[0].focus();
      }
    };

    const toggleNextproject = () => {
      toggleFullscreen();
      goNext();
    };

    const countDown = () => {
      const TIMER_LENGTH_MINUTES =
        parseInt(process.env.VUE_APP_TIMER_LENGTH) || 3;
      const pc_per_tick =
        TIMER_LENGTH_MINUTES > 0 ? 100 / (60 * TIMER_LENGTH_MINUTES) : 0;
      if (pc_per_tick == 0) return;
      if (ruigehond.value >= 100) {
        ruigehond.value = 100;
        return;
      }
      ruigehond.value += pc_per_tick;
      setTimeout(() => {
        countDown();
      }, 1000);
    };

    return {
      active,
      fullscreen,
      ruigehond,
      joinTeam,
      openComment,
      contactTeam,
      seeDetails,
      seePerson,
      isWithslides,
      isEmbeddable,
      getEmbed,
      seeEmbed,
      selectNone,
      goNext,
      goPrev,
      touchStart,
      toggleFullscreen,
      toggleNextproject,
    };
  },
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: #ffffff;
  box-shadow: 2px 2px 20px 1px;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  width: 80%;
  height: 80%;
  border-radius: 10px;
}

.modal-header,
.modal-footer {
  padding: 15px;
  display: flex;
}

.modal-header {
  position: relative;
  border-bottom: 1px solid #eeeeee;
  color: #4aae9b;
  justify-content: space-between;
}

.modal-footer {
  border-top: 1px solid #eeeeee;
  flex-direction: column;
  justify-content: flex-end;
}

.modal-body {
  position: relative;
  padding: 20px 10px;
  overflow-y: auto;
}

.modal-close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  font-size: 20px;
  padding: 10px;
  cursor: pointer;
  font-weight: bold;
  color: #4aae9b;
  background: transparent;
}

div,
p,
button {
  font-family: M3Regular, "Open Sans", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol";
}
div.content * {
  font-family: "Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol";
}

.titlebar {
  border-bottom: 0.2em solid transparent;
  text-align: center;
  clear: both;
}
.name {
  margin-top: 0em;
  color: black;
  /*font-weight: bold;*/
  font-size: 2.5rem;
  line-height: 1.2;
  display: block;
  text-decoration: none;
  text-align: left;
}
.summary {
  font-weight: bolder;
  text-align: left;
  min-height: 1em;
  font-size: 1.5rem;
}
.hashtag {
  font-family: monospace;
  font-weight: bold;
  color: #999;
  font-size: 1rem;
  float: right;
  display: inline-block;
}
.teamroster {
  max-width: 80%;
  text-align: left;
  margin-bottom: 1em;
}
.teamroster div {
  display: inline;
}
.teamroster .person {
  margin: 0 0.4em;
  padding: 0 0.4em;
}
.teamroster .person:before {
  content: "🏀 ";
  font-size: 75%;
  white-space: nowrap;
  vertical-align: super;
  opacity: 0.5;
}
.ident {
  font-weight: bold;
  font-size: 200%;
  color: red;
  float: right;
  text-shadow: 1px 1px 1px white;
  font-family: monospace;
  line-height: 0em;
  margin: -1em 0 0em 1em;
  padding: 0px;
  display: inline-block;
}

.eventheader {
  display: block;
  border-top: 4px solid #ccc;
  margin-top: 60px;
  padding-top: 60px;
  margin-bottom: 120px;
}

.imagepreview-floating {
  display: inline-block;
  position: fixed;
  z-index: 100;
  bottom: 3px;
  left: 3px;
  height: 120px;
  width: 120px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-repeat: no-repeat;
  background-color: white;
  background-size: cover;
  background-position: 0% 50%;
}

.imagepreview-overlay,
.imagepreview-underlay {
  display: block;
  width: 100%;
  height: 120px;
  margin-top: -18px;
  margin-bottom: 27px;
}
.imagepreview-underlay {
  filter: saturate(0%) contrast(0.2) brightness(0.4);
  z-index: -1;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;
  margin-left: -10%;
  position: fixed;
  z-index: 99;
}
.imagepreview-overlay {
  position: fixed;
  z-index: 100;
  background-repeat: no-repeat;
  background-color: transparent;
  background-size: contain;
  background-position: 0% 50%;
}

.preview {
  text-align: left;
  color: black;
  line-height: 140%;
  margin-bottom: 2em;
  padding-bottom: 4em;
}

.autotext-link {
  display: inline-block;
  text-decoration: none;
  color: #aaa;
  font-weight: bold;
  letter-spacing: 25%;
  font-size: 150%;
  text-align: left;
  line-height: 0em;
  margin: 1em 0em 0em;
}
@media (min-width: 768px) {
  .autotext-link {
    transform: translate(-2em, 0);
  }
  .summary {
    max-width: 80%;
  }
}
.autotext-open {
  display: block;
  color: blue;
  text-align: center;
  margin: 1em;
}
.autotext-nav {
  display: block;
  text-align: center;
  margin-bottom: 0.5em;
}
.autotext-nav a {
  color: #999;
  margin-right: 1em;
}
.autotext-nav a::before {
  content: "⯆";
  font-size: 80%;
  top: -0.1em;
  left: -0.2em;
  display: inline-block;
  position: relative;
}

.phase {
  margin: 0em 1em;
  opacity: 0.5;
}

.modal-footer button {
  opacity: 0.9;
  transition: all 0.3s ease;
  border: none;
  height: 1.5em;
  padding: 2pt 6pt 2pt;
}
.modal-footer:hover button {
  opacity: 1;
}
button.nav-next {
  float: right;
}
button.nav-prev {
  float: left;
}
.dark .footer button {
  background: black;
  color: white;
}
.status button {
  margin: 0 0.5em 0 0;
  font-size: 80%;
}
.status {
  font-family: monospace;
  font-weight: normal;
  font-size: 125%;
  margin-top: 1em;
  margin-bottom: 1em;
  padding: 5px 7px;
  background: white;
  width: 100%;
  text-align: center;
}

.dark .status {
  background: black;
  color: white;
}

.frame-container iframe {
  width: 100% !important;
  height: 100% !important;
  border: none !important;
}
.frame-container {
  width: 100%;
  height: 600px;
  box-shadow: 5px 5px 10px #535353;
  margin-bottom: 1em;
  border: 1px silver;
  border-radius: 4px;
  overflow: hidden;
  position: sticky;
}

.webembed {
  width: 400px;
  height: 225px;
  max-width: 100%;
  border: 1px solid silver;
  box-shadow: 5px 5px 10px #cce;
  padding: 0px;
  margin: 0px;
}

.go-fullscreen {
  font-size: 1em;
  margin-top: -0.5em;
  display: block;
  box-shadow: none;
}
.go-fullscreen span {
  font-size: 0px;
}
.go-fullscreen:hover span {
  font-size: initial;
}
@media (min-width: 768px) {
  .webembed {
    width: 600px;
    height: 338px;
  }
}
@media (min-width: 1280px) {
  .webembed {
    width: 700px;
    height: 393px;
  }
}
.dark .webembed-fullscreen {
  background: black;
}
.webembed-fullscreen {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  background: white;
  z-index: 9998;
}
.webembed-fullscreen button {
  bottom: 0px;
  right: 3px;
  position: absolute;
  z-index: 9999;
  box-shadow: none;
  font-size: 1em;
  margin: 0px;
  padding: 3px 9px;
  border: 1px solid grey;
  cursor: pointer;
  background: white;
  color: black;
}
.webembed-fullscreen button:hover {
  border: 1px solid black;
  color: black;
}
.dark .webembed-fullscreen button {
  background: black;
  color: white;
}
.webembed-fullscreen iframe {
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  position: absolute;
  border: 0px;
  padding: 0px;
  margin: 0px;
}
button.fullscreen-demo-button {
  right: 56px;
  color: gray;
}
button.fullscreen-next-button {
  right: 30px;
}

@media (min-width: 768px) {
  .preview {
    margin-left: 10%;
    margin-right: 10%;
  }

  .status {
    width: auto;
    position: fixed;
    bottom: 0px;
    left: 50%;
    text-align: center;
    width: 40em;
    margin-left: -20em;
    margin-bottom: 0em;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    border-bottom: none;
  }
}

#ruigehond {
  z-index: 9998;
  position: fixed;
  display: block;
  left: 0;
  bottom: 0px;
  width: 100%;
  height: 10px;
  margin: 0;
  overflow: visible;
  background-color: rgb(0, 0, 0, 0);
}
#ruigehond.finished {
  animation-name: pulsate;
  animation-duration: 2s;
  animation-iteration-count: infinite;
  animation-direction: alternate-reverse;
  animation-timing-function: ease;
}
@keyframes pulsate {
  from {
    background-color: rgb(255, 0, 0);
  }
  to {
    background-color: rgb(0, 0, 0);
  }
}
#ruigehond.finished > div {
  display: none;
}
#ruigehond > div {
  display: block;
  background: linear-gradient(to right, #0e91f8, #e42fe2);
  border-right: 1px solid gray;
  width: 0px;
  height: 100%;
}
</style>