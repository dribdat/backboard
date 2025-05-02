<template>
  <div class="challenges">

    <Header v-if="isHeadline" :event="event"></Header>

    <row container :gutter="20" v-if="!isHexagons">
      <column
        :xs="12"
        :md="4"
        :lg="3"
        v-for="project in filterProjects"
        :key="project.id"
      >
        <div
          class="col project-container"
          :challenge="project.is_challenge"
          v-if="isChallenges || !project.is_challenge"
          :style="
            project.image_url ?
              'background-image:url(' + project.image_url + ')'
              : project.is_challenge && event.logo_url ?
                'background-image:url(' + event.logo_url + ')'
                : ''
          "
        >
          <div :class="project.image_url ? 'project has-thumb' : 'project'"
               @click="seePreview(project)"
          >

            <div class="team-stats">
              <div class="team-counter"
                   :title="project.team.join(', ')">
                <span class="hex">👤</span>
                <div class="count">{{ project.team.length }}</div>
              </div>
              <div class="score-counter"
                   v-show="project.statistics"
                   :title="project.statistics">
                <span class="hex">&#11042;</span>
                <div class="count" v-if="project.stats">{{ project.stats.total }}</div>
              </div>
            </div>

            <div class="name">
              {{ project.name }}
            </div>

            <div class="progress"
              :title="project.phase + ': ' + project.score + '%'"
              v-if="!project.is_challenge && project.score && project.score > 0">
              <div class="progress-bar" role="progressbar"
                :style="'width:' + project.score + '%'">
              </div>
            </div>

            <div v-show="project.summary || !project.is_challenge" class="summary">
              <p>{{ project.summary }}</p>
            </div>

            <div class="team-join" v-if="isButtons">
              <button @click="joinTeam(project)" title="Join">🏀</button>
              <button v-if="isComments" @click="openComment(project)" title="Comment">💬</button>
              <button v-show="project.contact_url" @click="contactTeam(project)" title="Contact">👋</button>
            </div>

          </div>
        </div>
      </column>
    </row>

    <Previews v-if="isPreviews" v-model="activePreview"
            @close="$emit('previewOff')"
            :withChallenges="isChallenges"
            :withComments="isComments"
            :withButtons="isButtons"
            :showExcerpt="isExcerpts"
            :projects="projects"
            :eventData="isHeadline ? event : null"
            :profileUrl="profileUrl"
            ></Previews>

    <Honeycomb v-if="isHexagons && projects != null"
            @preview="seePreview"
            :projects="filterProjects"></Honeycomb>

    <Countdown v-if="isCountdown" :event="event"></Countdown>

    <Footer v-if="isHeadline" :event="event"></Footer>

    <div class="loading" v-if="projects == null" title="Loading ..."><i class="ball">🏀</i></div>

    <div class="error" v-if="errorMessage">{{ errorMessage }}</div>

    <div class="options" v-show="toolbar">
      <button class="modal-close-button" @click="$emit('closeToolbar')" title="Close">⬡</button>
      <span class="share-button btn">
        🌐<a :href="shareUrl()">Share</a>
      </span>
      &nbsp;
      <input type="checkbox" v-model="isHeadline" id="isHeadline">
        <label for="isHeadline" title="Header">⛳</label>
      <input type="checkbox" v-model="isChallenges" id="isChallenges">
        <label for="isChallenges" title="Show Challenges">🏆</label>
      <input type="checkbox" v-model="isHexagons" id="isHexagons">
        <label for="isHexagons" title="Hexgrid mode">⬣</label>
      <input type="checkbox" v-model="isCountdown" id="isCountdown">
        <label for="isCountdown" title="Countdown">⏰</label>
      <input type="checkbox" v-model="isPreviews" id="isPreviews">
        <label for="isPreviews" title="Pop-ups">👀</label>
      <input type="checkbox" v-model="isExcerpts" id="isExcerpts">
        <label for="isExcerpts" title="Excerpts">🖼️</label>
      <input type="checkbox" v-model="isButtons" id="isButtons">
        <label for="isButtons" title="Join/Contact button">🪟</label>
      <input type="checkbox" v-model="isComments" id="isComments">
        <label for="isComments" title="Comment buttons">💬</label>
      <select v-model="darkMode" id="darkMode"
             @change="changeDark">
        <option value="default" selected>🌗</option>
        <option v-for="option in darkOptions"
                v-bind:value="option.id" >{{ option.name }}</option>
      </select>&nbsp;
      <select v-model="sortOrder" id="sortBy"
             @change="changeOrder">
        <option value="default" selected>📚</option>
        <option v-for="option in sortOptions"
                v-bind:value="option.id" >{{ option.name }}</option>
      </select>&nbsp;
    </div>
  </div>
</template>

<script>
import { Row, Column } from "vue-grid-responsive";

import moment from 'moment'

import Header from './Header'
import Footer from './Footer'
import Previews from './Previews'
import Countdown from './Countdown'
import Honeycomb from './Honeycomb'

export default {
  name: "Challenges",
  props: {
    src: String,
    dribs: String,
    options: String,
    toolbar: Boolean
  },
  components: {
    row: Row,
    column: Column,
    Countdown,
    Honeycomb,
    Previews,
    Header,
    Footer
  },
  data() {
    return {
      event: {},
      projects: null,
      activities: null,
      profileUrl: null,
      errorMessage: null,
      isButtons: true,
      isComments: false,
      isChallenges: false,
      isHeadline: false,
      isCountdown: false,
      isHexagons: false,
      isPreviews: false,
      isExcerpts: false,
      activePreview: -1,
      sortOrder: 'title',
      sortOptions: [
        { id: 'id', name: 'id' },
        { id: 'ident', name: 'Ident' },
        { id: 'name', name: 'Name' },
        { id: 'summary', name: 'Summary' },
        { id: 'hashtag', name: 'Hashtag' },
        { id: 'score', name: 'Score' }
      ],
      darkMode: 'default',
      darkOptions: [
        { id: 'default', name: 'System' },
        { id: 'light', name: 'Light' },
        { id: 'dark', name: 'Dark' }
      ]
    };
  },
  computed: {
    filterProjects: function() {
      if (this.projects === null) return [];
      let showChallenges = this.isChallenges;
      return this.projects.filter(function (p) {
        return showChallenges || !p.is_challenge
      });
    }
  },
  mounted() {
    // Check if projects can be loaded
    if (this.projects !== null) return;
    // Get request configuration
    const shareOptions = window.location.search || this.options;
    const urlParams = new URLSearchParams(shareOptions);
    this.isHeadline = Boolean(urlParams.get("headline"));
    this.isCountdown = Boolean(urlParams.get("countdown"));
    this.isHexagons = Boolean(urlParams.get("hexagons"));
    this.isButtons = Boolean(urlParams.get("buttons"));
    this.isPreviews = Boolean(urlParams.get("previews"));
    this.isExcerpts = Boolean(urlParams.get("excerpts"));
    this.isComments = Boolean(urlParams.get("comments"));
    this.isChallenges = Boolean(urlParams.get("challenges"));
    this.sortOrder = urlParams.get("sort") || "default";
    this.darkMode = urlParams.get("dark") || "default";
    let datasrc = this.src;
    // Override with URL parameter if default value set
    if (urlParams.get("src") && (!datasrc || datasrc == './datapackage.json')) {
      datasrc = urlParams.get("src").replaceAll('#', '');
      if (datasrc.indexOf('/api/event')<0 && !datasrc.endsWith('datapackage.json')) {
        if (datasrc[datasrc.length-1] !== '/') this.src += '/';
        datasrc += 'api/event/current/datapackage.json';
      }
    }
    if (!datasrc) {
      return this.errorMessage = "No data source provided.";
    }
    if (!this.dribs && datasrc.endsWith('datapackage.json')) {
      this.dribs = datasrc.replace('datapackage.json', 'posts.json?limit=200');
    }
    // Continue with loading event
    console.debug("Loading", datasrc);
    fetch(datasrc)
      .then(async (response) => {
        // check for error response
        if (!response.ok) {
          // get error message from body or default to response statusText
          const error = response.statusText;
          return Promise.reject(error);
        }

        const data = await response.json();
        // console.debug(data);

        // get server path
        if (this.src.indexOf('/api/')>0) {
          this.profileUrl = this.src.replace(/(.*)\/api\/.*/, "$1/user/");
        } else if (data.sources && data.sources.length) {
          this.profileUrl = (data.sources[0].path + 'user/');
        } else {
          this.profileUrl = null;
        }

        if (typeof data.projects === 'undefined' && data.resources.length > 0) {
          data.projects = null;
          data.resources.forEach(function(r) {
            if (r.name == 'projects') {
              data.projects = r.data;
            } else if (r.name == 'events') {
              data.event = r.data[0];
            }
          });
          if (data.projects === null) {
            return Promise.reject('Project data not found');
          }
        }

        //console.info("Projects data loaded");
        this.projects = [];

        data.projects.forEach((p) => {
          // Assign a boolean for challenge status
          p.is_challenge = p.progress < 2;
          // Format the date
          p.date = moment(p.updated_at).format('MMM Do, YYYY');
          // Ensure image_url attribute always present
          p.image_url = typeof p.image_url === "undefined" ? null : p.image_url;
          if (!p.image_url && data.event && data.event.logo_url) {
            p.image_url = data.event.logo_url;
          }
          // Check format of team
          p.team = (typeof p.team === 'string') ?
            p.team.replaceAll(",", " ").replaceAll("  ", " ").split(" ") : p.team;
          this.projects.push(p);
        });

        this.projects.forEach((p) => {
          // Prepare statistics summary
          p.statistics = "";
          if (p.stats) {
            p.stats['bytes pitch'] = p.stats['sizepitch'];
            delete p.stats['sizepitch'];
            p.stats['bytes total'] = p.stats['sizetotal'];
            delete p.stats['sizetotal'];
            Object.keys(p.stats).forEach(function(k) {
              p.statistics += k + ': ' + p.stats[k] + '\n';
            })
            p.stats['score'] = p.score;
          }
          // Limit score to 100%
          p.score = Math.min(p.score, 100);
        });

        // Try to set title from data package
        if (data.title) {
          document.title = data.title;
        } else if (data.projects.length > 0) {
          document.title = data.projects[0].event_name;
        }

        // Set event data if available
        if (typeof data.event !== 'undefined') {
          this.event = data.event;
          this.event.webpage = this.event.webpage_url || this.event.community_url || data.homepage;
          this.event.starts_at = this.event.starts_at || this.event.date;
          this.event.ends_at = this.event.ends_at || this.event.starts_at || this.event.date;
          // console.log(this.event);
        }

        // Load the activity data
        if (this.dribs) {
          fetch(this.dribs)
            .then(async (response) => {
              console.debug("Loading Dribs", this.dribs);
              const data = await response.json();
              this.activities = data.activities.sort((a,b) => {
                return a.time < b.time;
              });
              //console.log(this.activities);
              this.activities.forEach(el => {
                let proj = this.projects.filter((p) => {
                  if (p.id == el.project_id) {
                    if (typeof p.activities === 'undefined') {
                      p.activities = [];
                    }
                    p.activities.push(el);
                    return true;
                  }
                  return false;
                });
                if (!proj) {
                  console.warn('Project not found', el);
                  return;
                }
              });
            })
            .catch((error) => {
              console.warn('No posts data available.');
            });
        }

        // Propagate initial values
        this.changeOrder();
        this.changeDark();
      })
      .catch((error) => {
        this.errorMessage = error;
      });
  },
  methods: {
    // Helper link to join a project team
    joinTeam: function (project) {
      window.open(project.url + "/star/me");
    },
    openComment: function (project) {
      window.open(project.url + "/comment");
    },
    contactTeam: function (project) {
      window.open(project.contact_url);
    },
    seeDetails: function (project) {
      window.open(project.url);
    },
    changeDark: function() {
      this.$emit('darkMode', this.darkMode);
    },
    changeOrder: function () {
      console.debug('Sorting by', this.sortOrder);
      if (this.sortOrder == 'id') {
        // Sort by id
        this.projects.sort((a, b) => a.id < b.id);
      } else if (this.sortOrder == 'name') {
        // Sort by name
        this.projects.sort((a, b) => a.name.localeCompare(b.name));
      } else if (this.sortOrder == 'summary') {
        // Sort by summary
        this.projects.sort((a, b) => a.summary.localeCompare(b.summary));
      } else if (this.sortOrder == 'ident') {
        // Sort by ident
        this.projects.sort((a, b) => a.ident.localeCompare(b.ident));
      } else if (this.sortOrder == 'hashtag') {
        // Sort by hashtag
        this.projects.sort((a, b) => a.hashtag.localeCompare(b.hashtag));
      } else if (this.sortOrder == 'score') {
        // Sort by score
        this.projects.sort((a, b) => a.score < b.score);
      } else {
        // Sort by score then id (challenge) or name (project)
        this.projects.sort((a, b) =>
          a.is_challenge ?
              a.id < b.id :
              a.score <= b.score && a.name.localeCompare(b.name)
        );
      }
    },
    seePreview: function (project) {
      if (!this.isPreviews) {
        return this.seeDetails(project);
      }
      if (this.activePreview == project.id) {
        this.activePreview = -1;
        this.$emit('previewOff');
      } else {
        this.activePreview = project.id;
        this.$emit('previewOn');
      }
    },
    shareUrl: function () {
      return '?' +
        (this.isHeadline ? '&headline=1' : '') +
        (this.isCountdown ? '&countdown=1' : '') +
        (this.isHexagons ? '&hexagons=1' : '') +
        (this.isPreviews ? '&previews=1' : '') +
        (this.isExcerpts ? '&excerpts=1' : '') +
        (this.isButtons ? '&buttons=1' : '') +
        (this.isComments ? '&comments=1' : '') +
        (this.isChallenges ? '&challenges=1' : '') +
        (this.darkMode ? '&dark=' + this.darkMode : '') +
        (this.sortOrder ? '&sort=' + this.sortOrder : '') +
      '';
    }
  }
};
</script>

<style scoped>

/* -- Main display -- */

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

.col {
  width: 100%;
  padding: 15px 8px;
  box-sizing: border-box;
  color: #263238;
  text-align: center;
  background-color: white;
  font-size: 14pt;
  box-shadow:
    0 4px 2px 0 rgba(0, 0, 0, 0.1),
    0 1px 13px 0 rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #eee;
  border-radius: 6px;
}
.col:hover {
  border-color: #ccc;
}
.col[challenge].project-container {
  background: repeating-linear-gradient(
    45deg,
    #dde,
    #dde 10px,
    #fefefe 10px,
    #ffffff 20px
  );
  border: 3px solid #eee;
}
.col[challenge].project-container .team-stats {
  display: none;
}

.project-container {
  display: inline-block;
  background-color: #fff;
  background-size: 95% auto;
  background-repeat: no-repeat;
  background-position: center 5px;
  padding: 0px;
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
  font-size: 60%; opacity: 0.5;
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

.summary, .excerpt {
  text-align: left;
  color: black;
  line-height: 140%;
}
.summary, .excerpt {
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
  margin: 0.5em 1em ;
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
  width: 1em; height: 1em;
  font-size: 300%;
  margin: 0em;
  line-height: 0px;
  animation: bounce 0.5s infinite;
  animation-fill-mode: both;
  animation-direction: alternate;
  animation-timing-function: cubic-bezier(1,0,1,0);
}
.loading .ball {
  font-style: normal;
  display: inline-block;
  animation: rotate 3s infinite;
  animation-timing-function: cubic-bezier(0,0,0,0);
  transform-origin: 50% 0%;
}

@-webkit-keyframes rotate {
    from { -webkit-transform: rotate(-180deg) }
    to { -webkit-transform: rotate(180deg) }
}
@-webkit-keyframes bounce {
    from { margin-top: -5em }
    to { margin-top: 0em }
}
</style>
