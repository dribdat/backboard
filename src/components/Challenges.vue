<template>
  <div class="challenges">
    <Header v-if="isHeadline" :event="event"></Header>

    <div class="grid-container" v-if="!isHexagons">
      <div
        class="grid-item"
        v-for="project in filterProjects"
        :key="project.id"
      >
        <div
          class="project-container"
          :challenge="project.is_challenge"
          v-if="isChallenges || !project.is_challenge"
          :style="
            project.image_url
              ? 'background-image:url(' + project.image_url + ')'
              : project.is_challenge && event.logo_url
              ? 'background-image:url(' + event.logo_url + ')'
              : ''
          "
        >
          <div
            :class="project.image_url ? 'project has-thumb' : 'project'"
            @click="seePreview(project)"
          >
            <div class="team-stats">
              <div class="team-counter" :title="project.team.join(', ')">
                <span class="hex">👤</span>
                <div class="count">{{ project.team.length }}</div>
              </div>
              <div
                class="score-counter"
                v-show="project.statistics"
                :title="project.statistics"
              >
                <span class="hex">&#11042;</span>
                <div class="count" v-if="project.stats">
                  {{ project.stats.total }}
                </div>
              </div>
            </div>

            <div class="name">
              {{ project.name }}
            </div>

            <div
              class="progress"
              :title="project.phase + ': ' + project.score + '%'"
              v-if="
                !project.is_challenge && project.score && project.score > 0
              "
            >
              <div
                class="progress-bar"
                role="progressbar"
                :style="'width:' + project.score + '%'"
              ></div>
            </div>

            <div
              v-show="project.summary || !project.is_challenge"
              class="summary"
            >
              <p>{{ project.summary }}</p>
            </div>

            <div class="team-join" v-if="isButtons">
              <button @click="joinTeam(project)" title="Join">🏀</button>
              <button
                v-if="isComments"
                @click="openComment(project)"
                title="Comment"
              >
                💬
              </button>
              <button
                v-show="project.contact_url"
                @click="contactTeam(project)"
                title="Contact"
              >
                👋
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Previews
      v-if="isPreviews"
      v-model="activePreview"
      @close="$emit('previewOff')"
      :withChallenges="isChallenges"
      :withComments="isComments"
      :withButtons="isButtons"
      :showExcerpt="isExcerpts"
      :projects="projects"
      :eventData="isHeadline ? event : null"
      :profileUrl="profileUrl"
    ></Previews>

    <ProjectHoneycomb
      v-if="isHexagons && projects != null"
      @preview="seePreview"
      :projects="filterProjects"
    ></ProjectHoneycomb>

    <Countdown v-if="isCountdown" :event="event"></Countdown>

    <Footer v-if="isHeadline" :event="event"></Footer>

    <div class="loading" v-if="projects == null" title="Loading ...">
      <i class="ball">🏀</i>
    </div>

    <div class="error" v-if="errorMessage">{{ errorMessage }}</div>

    <div class="options" v-show="toolbar">
      <button
        class="modal-close-button"
        @click="$emit('closeToolbar')"
        title="Close"
      >
        ⬡
      </button>
      <span class="share-button btn">
        🌐<a :href="shareUrl()">Share</a>
      </span>
      &nbsp;
      <input type="checkbox" v-model="isHeadline" id="isHeadline" />
      <label for="isHeadline" title="Header">⛳</label>
      <input type="checkbox" v-model="isChallenges" id="isChallenges" />
      <label for="isChallenges" title="Show Challenges">🏆</label>
      <input type="checkbox" v-model="isHexagons" id="isHexagons" />
      <label for="isHexagons" title="Hexgrid mode">⬣</label>
      <input type="checkbox" v-model="isCountdown" id="isCountdown" />
      <label for="isCountdown" title="Countdown">⏰</label>
      <input type="checkbox" v-model="isPreviews" id="isPreviews" />
      <label for="isPreviews" title="Pop-ups">👀</label>
      <input type="checkbox" v-model="isExcerpts" id="isExcerpts" />
      <label for="isExcerpts" title="Excerpts">🖼️</label>
      <input type="checkbox" v-model="isButtons" id="isButtons" />
      <label for="isButtons" title="Join/Contact button">🪟</label>
      <input type="checkbox" v-model="isComments" id="isComments" />
      <label for="isComments" title="Comment buttons">💬</label>
      <select v-model="darkMode" id="darkMode" @change="changeDark">
        <option value="default" selected>🌗</option>
        <option
          v-for="option in darkOptions"
          :key="option.id"
          :value="option.id"
        >
          {{ option.name }}
        </option>
      </select>
      &nbsp;
      <select v-model="sortOrder" id="sortBy" @change="changeOrder">
        <option value="default" selected>📚</option>
        <option
          v-for="option in sortOptions"
          :key="option.id"
          :value="option.id"
        >
          {{ option.name }}
        </option>
      </select>
      &nbsp;
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import moment from "moment";
import Header from "./Header.vue";
import Footer from "./Footer.vue";
import Previews from "./Previews.vue";
import Countdown from "./Countdown.vue";
import ProjectHoneycomb from "./Honeycomb.vue";

export default {
  name: "ProjectChallenges",
  props: {
    src: String,
    dribs: String,
    options: String,
    toolbar: Boolean,
  },
  components: {
    Countdown,
    ProjectHoneycomb,
    Previews,
    Header,
    Footer,
  },
  setup(props, { emit }) {
    const event = ref({});
    const projects = ref(null);
    const activities = ref(null);
    const profileUrl = ref(null);
    const errorMessage = ref(null);
    const isButtons = ref(true);
    const isComments = ref(false);
    const isChallenges = ref(false);
    const isHeadline = ref(false);
    const isCountdown = ref(false);
    const isHexagons = ref(false);
    const isPreviews = ref(false);
    const isExcerpts = ref(false);
    const activePreview = ref(-1);
    const sortOrder = ref("title");
    const sortOptions = ref([
      { id: "id", name: "id" },
      { id: "ident", name: "Ident" },
      { id: "name", name: "Name" },
      { id: "summary", name: "Summary" },
      { id: "hashtag", name: "Hashtag" },
      { id: "score", name: "Score" },
    ]);
    const darkMode = ref("default");
    const darkOptions = ref([
      { id: "default", name: "System" },
      { id: "light", name: "Light" },
      { id: "dark", name: "Dark" },
    ]);

    const filterProjects = computed(() => {
      if (projects.value === null) return [];
      return projects.value.filter(
        (p) => isChallenges.value || !p.is_challenge
      );
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

    const seeDetails = (project) => {
      window.open(project.url);
    };

    const changeDark = () => {
      emit("darkMode", darkMode.value);
    };

    const changeOrder = () => {
      if (sortOrder.value == "id") {
        projects.value.sort((a, b) => a.id < b.id);
      } else if (sortOrder.value == "name") {
        projects.value.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortOrder.value == "summary") {
        projects.value.sort((a, b) => a.summary.localeCompare(b.summary));
      } else if (sortOrder.value == "ident") {
        projects.value.sort((a, b) => a.ident.localeCompare(b.ident));
      } else if (sortOrder.value == "hashtag") {
        projects.value.sort((a, b) => a.hashtag.localeCompare(b.hashtag));
      } else if (sortOrder.value == "score") {
        projects.value.sort((a, b) => a.score < b.score);
      } else {
        projects.value.sort((a, b) =>
          a.is_challenge
            ? a.id < b.id
            : a.score <= b.score && a.name.localeCompare(b.name)
        );
      }
    };

    const seePreview = (project) => {
      if (!isPreviews.value) {
        return seeDetails(project);
      }
      if (activePreview.value == project.id) {
        activePreview.value = -1;
        emit("previewOff");
      } else {
        activePreview.value = project.id;
        emit("previewOn");
      }
    };

    const shareUrl = () => {
      return (
        "?" +
        (isHeadline.value ? "&headline=1" : "") +
        (isCountdown.value ? "&countdown=1" : "") +
        (isHexagons.value ? "&hexagons=1" : "") +
        (isPreviews.value ? "&previews=1" : "") +
        (isExcerpts.value ? "&excerpts=1" : "") +
        (isButtons.value ? "&buttons=1" : "") +
        (isComments.value ? "&comments=1" : "") +
        (isChallenges.value ? "&challenges=1" : "") +
        (darkMode.value ? "&dark=" + darkMode.value : "") +
        (sortOrder.value ? "&sort=" + sortOrder.value : "") +
        ""
      );
    };

    onMounted(() => {
      if (projects.value !== null) return;
      const shareOptions = window.location.search || props.options;
      const urlParams = new URLSearchParams(shareOptions);
      isHeadline.value = Boolean(urlParams.get("headline"));
      isCountdown.value = Boolean(urlParams.get("countdown"));
      isHexagons.value = Boolean(urlParams.get("hexagons"));
      isButtons.value = Boolean(urlParams.get("buttons"));
      isPreviews.value = Boolean(urlParams.get("previews"));
      isExcerpts.value = Boolean(urlParams.get("excerpts"));
      isComments.value = Boolean(urlParams.get("comments"));
      isChallenges.value = Boolean(urlParams.get("challenges"));
      sortOrder.value = urlParams.get("sort") || "default";
      darkMode.value = urlParams.get("dark") || "default";
      let datasrc = props.src;
      if (
        urlParams.get("src") &&
        (!datasrc || datasrc == "./datapackage.json")
      ) {
        datasrc = urlParams.get("src").replaceAll("#", "");
        if (
          datasrc.indexOf("/api/event") < 0 &&
          !datasrc.endsWith("datapackage.json")
        ) {
          if (datasrc[datasrc.length - 1] !== "/") datasrc += "/";
          datasrc += "api/event/current/datapackage.json";
        }
      }
      if (!datasrc) {
        errorMessage.value = "No data source provided.";
        return;
      }
      let dribs_url = props.dribs;
      if (!dribs_url && datasrc.endsWith("datapackage.json")) {
        dribs_url = datasrc.replace(
          "datapackage.json",
          "posts.json?limit=200"
        );
      }
      fetch(datasrc)
        .then(async (response) => {
          if (!response.ok) {
            return Promise.reject(response.statusText);
          }
          const data = await response.json();
          if (props.src.indexOf("/api/") > 0) {
            profileUrl.value = props.src.replace(/(.*)\/api\/.*/, "$1/user/");
          } else if (data.sources && data.sources.length) {
            profileUrl.value = data.sources[0].path + "user/";
          } else {
            profileUrl.value = null;
          }
          if (
            typeof data.projects === "undefined" &&
            data.resources.length > 0
          ) {
            data.projects = null;
            data.resources.forEach(function (r) {
              if (r.name == "projects") {
                data.projects = r.data;
              } else if (r.name == "events") {
                data.event = r.data[0];
              }
            });
            if (data.projects === null) {
              return Promise.reject("Project data not found");
            }
          }
          projects.value = [];
          data.projects.forEach((p) => {
            p.is_challenge = p.progress < 2;
            p.date = moment(p.updated_at).format("MMM Do, YYYY");
            p.image_url =
              typeof p.image_url === "undefined" ? null : p.image_url;
            if (!p.image_url && data.event && data.event.logo_url) {
              p.image_url = data.event.logo_url;
            }
            p.team =
              typeof p.team === "string"
                ? p.team.replaceAll(",", " ").replaceAll("  ", " ").split(" ")
                : p.team;
            projects.value.push(p);
          });
          projects.value.forEach((p) => {
            p.statistics = "";
            if (p.stats) {
              p.stats["bytes pitch"] = p.stats["sizepitch"];
              delete p.stats["sizepitch"];
              p.stats["bytes total"] = p.stats["sizetotal"];
              delete p.stats["sizetotal"];
              Object.keys(p.stats).forEach(function (k) {
                p.statistics += k + ": " + p.stats[k] + "\n";
              });
              p.stats["score"] = p.score;
            }
            p.score = Math.min(p.score, 100);
          });
          if (data.title) {
            document.title = data.title;
          } else if (data.projects.length > 0) {
            document.title = data.projects[0].event_name;
          }
          if (typeof data.event !== "undefined") {
            event.value = data.event;
            event.value.webpage =
              event.value.webpage_url ||
              event.value.community_url ||
              data.homepage;
            event.value.starts_at = event.value.starts_at || event.value.date;
            event.value.ends_at =
              event.value.ends_at || event.value.starts_at || event.value.date;
          }
          if (dribs_url) {
            fetch(dribs_url)
              .then(async (response) => {
                const data = await response.json();
                activities.value = data.activities.sort((a, b) => {
                  return a.time < b.time;
                });
                activities.value.forEach((el) => {
                  let proj = projects.value.filter((p) => {
                    if (p.id == el.project_id) {
                      if (typeof p.activities === "undefined") {
                        p.activities = [];
                      }
                      p.activities.push(el);
                      return true;
                    }
                    return false;
                  });
                  if (!proj) {
                    return;
                  }
                });
              })
              .catch(() => {});
          }
          changeOrder();
          changeDark();
        })
        .catch((err) => {
          errorMessage.value = err;
        });
    });

    return {
      event,
      projects,
      activities,
      profileUrl,
      errorMessage,
      isButtons,
      isComments,
      isChallenges,
      isHeadline,
      isCountdown,
      isHexagons,
      isPreviews,
      isExcerpts,
      activePreview,
      sortOrder,
      sortOptions,
      darkMode,
      darkOptions,
      filterProjects,
      joinTeam,
      openComment,
      contactTeam,
      seeDetails,
      changeDark,
      changeOrder,
      seePreview,
      shareUrl,
    };
  },
};
</script>

<style scoped>
/* -- Main display -- */

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-gap: 20px;
}

.challenges > .section-header {
  margin-left: 15%;
  margin-bottom: 2em;
}

@media (max-width: 768px) {
  .challenges > .section-header {
    margin-left: 5%;
  }
}

.challenges {
  color: #263238;
  box-sizing: border-box;
  padding: 20px 38px;
}

@media (max-width: 478px) {
  .challenges {
    padding: 0px;
    min-width: 320px;
  }
  .honeycomb {
    width: 80%;
    margin-top: 7em;
    margin-bottom: 15em;
    margin-left: 15%;
    text-align: left;
    transform: scale(1.2);
  }
}

.options {
  font-size: 90%;
  cursor: pointer;
  position: fixed;
  text-align: center;
  width: 100%;
  padding: 1em;
  bottom: 0px;
  left: 0px;
  margin: 0px;
  background: white;
  box-shadow: 0em 0em 1em black;
  z-index: 999;
}
.options:hover {
  opacity: 1;
}
.options label {
  margin-right: 1em;
}

.modal-close-button {
  top: 1em;
  right: 1.3em;
  position: absolute;
}

.project-container {
  display: inline-block;
  background-color: #fff;
  background-size: 95% auto;
  background-repeat: no-repeat;
  background-position: center 5px;
  padding: 0px;
  border: 1px solid #eee;
  border-radius: 6px;
}
.project-container:hover {
  border-color: #ccc;
}
.project-container[challenge="true"] {
  background: repeating-linear-gradient(
    45deg,
    #dde,
    #dde 10px,
    #fefefe 10px,
    #ffffff 20px
  );
  border: 3px solid #eee;
}
.project-container[challenge="true"] .team-stats {
  display: none;
}
.project-container > div {
  cursor: pointer;
}

.project {
  display: block;
  text-align: left;
  width: auto;
  margin: 0px;
  padding: 0.5em 1em;
  background: rgba(255, 255, 255, 1);
  margin-top: 50%;
  border-top: 1px solid #eee;
  border-radius: 4px;
  margin-bottom: -1px;
}
.project.has-thumb {
  /* border-left: 1px solid #ddd; */
}
.project .status {
  font-size: 60%;
  opacity: 0.5;
  font-family: monospace;
}
.project .name {
  color: #0089c7;
  font-weight: bold;
  font-size: 110%;
  display: block;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
  text-decoration: none;
}
.project .name .hex {
  -webkit-transform: rotate(30deg);
  transform: rotate(30deg);
  display: block;
  opacity: 0.4;
  float: right;
  margin-top: -0.8em;
  margin-right: -0.6em;
}
.project a:hover {
  color: blue;
}
.project .team-stats {
  background: white;
  display: block;
  float: right;
  font-size: 80%;
  color: #999;
  width: 3em;
  text-align: center;
  margin: 0.5em -1em 0.5em 0;
}
.project .summary {
  min-height: 5em;
}

.summary,
.excerpt {
  text-align: left;
  color: black;
  line-height: 140%;
}
.summary,
.excerpt {
  font-size: 85%;
  white-space: pre-wrap;
  white-space: -moz-pre-wrap;
  white-space: -pre-wrap;
  white-space: -o-pre-wrap;
  word-wrap: break-word;
}
.summary.rollup {
  text-align: left;
  margin: 0px;
  padding: 0px;
  position: absolute;
  display: inline-block;
  top: 6px;
  left: 0px;
  width: 100%;
}
.summary.rollup p {
  margin: 0.5em 1em;
  padding: 1em;
  background: #ffc;
  display: inline-block;
}
.rollup {
  display: block;
  height: auto;
  overflow: hidden;
  max-height: 0px;
  opacity: 0;
  transition: all 0.8s ease-in;
}
.project:hover .rollup {
  max-height: 1000px;
  opacity: 1;
}

.team-join {
  clear: both;
  display: block;
  text-align: center;
  margin-bottom: 1em;
}

.share-button a {
  text-decoration: none;
  margin-left: 0.3em;
}

.progress .progress-bar {
  width: 100%;
  display: block;
  height: 5px;
  background-color: #3399f3;
  color: #fff;
  min-width: 2em;
}

.loading {
  position: fixed;
  top: 55%;
  display: inline-block;
  width: 1em;
  height: 1em;
  font-size: 300%;
  margin: 0em;
  line-height: 0px;
  animation: bounce 0.5s infinite;
  animation-fill-mode: both;
  animation-direction: alternate;
  animation-timing-function: cubic-bezier(1, 0, 1, 0);
}
.loading .ball {
  font-style: normal;
  display: inline-block;
  animation: rotate 3s infinite;
  animation-timing-function: cubic-bezier(0, 0, 0, 0);
  transform-origin: 50% 0%;
}

@-webkit-keyframes rotate {
  from {
    -webkit-transform: rotate(-180deg);
  }
  to {
    -webkit-transform: rotate(180deg);
  }
}
@-webkit-keyframes bounce {
  from {
    margin-top: -5em;
  }
  to {
    margin-top: 0em;
  }
}
</style>