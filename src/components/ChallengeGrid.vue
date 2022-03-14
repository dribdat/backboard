<template>
  <div class="challenges">
    <row container :gutter="20" v-if="!isHexagons">
      <column
        :xs="8"
        :md="6"
        :lg="3"
        v-for="project in projects"
        :key="project.id"
      >
        <div
          class="col project-container"
          :challenge="project.is_challenge"
          :style="
            project.image_url
              ? 'background-image:url(' + project.image_url + ')'
              : ''
          "
          v-show="!isChallenges || !project.is_challenge"
        >
          <div :class="project.image_url ? 'project has-thumb' : 'project'">

            <div class="status">
              <b class="phase">{{ project.phase }}</b>
              on
              <span class="date">{{ project.date }}</span>
            </div>

            <a class="name" :href="project.url" target="_blank">
              {{ project.name }}
            </a>

            <div class="team-stats" v-show="!project.is_challenge">
              <div class="team-counter" v-show="project.team.length > 0">
                <span class="hex">👤</span>
                <div class="count">{{ project.team.length }}</div>
              </div>
              <div class="score-counter" v-show="project.score > 0">
                <span class="hex">&#11042;</span>
                <div class="count">{{ project.score }}</div>
              </div>
            </div>

            <div class="team-roster" v-show="!project.is_challenge && project.team.length > 0">
              <a
                v-for="user in project.team"
                :key="user"
                :href="profileUrl + user"
                target="_blank"
                class="avatar"
                >
                <span>{{ user }}</span>
              </a>
            </div>

            <div class="join" v-if="isButtons">
              <button @click="joinTeam(project)">👍 Join</button>
              <!-- <button @click="seeDetails(project)">🕮 {{ project.phase }}</button> -->
            </div>

            <div v-show="project.summary" class="rollup summary">
              <p>{{ project.summary }}</p>
            </div>

            <markdown v-show="isPreviews" class="excerpt" :source="project.excerpt" />
          </div>
        </div>
      </column>
    </row>

    <div class="honeycomb" v-if="isHexagons">
      <a
        v-for="project in projects"
        :key="project.id"
        :href="project.url" target="_blank"
        :class="'hexagon ' + (project.is_challenge ? 'challenge' : 'project')"
        :challenge="project.is_challenge"
        v-show="project.is_challenge"
      >
      <!-- :style="(project.image_url ? 'background-image:url(' + project.image_url + ')' : '') + ';border-bottom-color:' + project.logo_color" -->
        <div class="hexagontent">
          <span>{{ project.name }}</span>
          <div class="hexaicon"
              v-if="project.image_url"
              :style="'background-image:url(' + project.image_url + ')'"></div>
              <div class="progress"
                v-if="project.score && project.score > 0">
                <div class="progress-bar" role="progressbar"
                  :style="'width:' + project.score + '%'">
                </div>
              </div>
          </div>
      </a>
    </div>

    <div class="error" v-if="errorMessage">{{ errorMessage }}</div>

    <div class="options">
      <input type="checkbox" v-model="isPreviews" id="isPreviews">
        <label for="isPreviews">Previews</label>
      <input type="checkbox" v-model="isButtons" id="isButtons">
        <label for="isButtons">Buttons</label>
      <input type="checkbox" v-model="isChallenges" id="isChallenges">
        <label for="isChallenges">Hide Challenges</label>
      <input type="checkbox" v-model="isHexagons" id="isHexagons">
        <label for="isHexagons">Hex Challenges</label>
      <span class="share-button">
        🌐<a :href="shareUrl()">Share</a>
      </span>
    </div>
  </div>
</template>

<script>
import { Row, Column } from "vue-grid-responsive";

import VueMarkdown from '@adapttive/vue-markdown'
import moment from 'moment'

export default {
  name: "ChallengeGrid",
  props: {
    src: String,
  },
  components: {
    row: Row,
    column: Column,
    markdown: VueMarkdown,
  },
  data() {
    return {
      projects: null,
      profileUrl: null,
      errorMessage: null,
      isButtons: true,
      isChallenges: false,
      isHexagons: false,
      isPreviews: false,
    };
  },
  mounted() {
    // Check if projects can be loaded
    if (this.projects !== null) return;
    // Get request configuration
    const urlParams = new URLSearchParams(window.location.search);
    this.isHexagons = Boolean(urlParams.get("hexagons"));
    this.isButtons = Boolean(urlParams.get("buttons"));
    this.isPreviews = Boolean(urlParams.get("previews"));
    this.isChallenges = Boolean(urlParams.get("challenges"));
    // Continue with loading event
    console.info("Loading", this.src);
    fetch(this.src)
      .then(async (response) => {
        const data = await response.json();
        // console.debug(data);

        // check for error response
        if (!response.ok) {
          // get error message from body or default to response statusText
          const error = (data && data.message) || response.statusText;
          return Promise.reject(error);
        }

        // get server path
        if (this.src.indexOf('/api/')>0) {
          this.profileUrl = this.src.replace(/(.*)\/api\/.*/, "$1/user/");
        } else if (data.homepage) {
          this.profileUrl = (data.homepage + '/user/');
        }
        this.profileUrl = this.profileUrl.replaceAll('//','/');

        if (typeof data.projects === 'undefined' && data.resources.length > 0) {
          data.projects = null;
          data.resources.forEach(function(r) {
            if (r.name == 'projects') {
              data.projects = r.data;
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
          p.is_challenge = p.progress < 1;
          // Format the date
          p.date = moment(p.updated_at).format('MMM Do, YYYY');
          // Ensure image_url attribute always present
          p.image_url = typeof p.image_url === "undefined" ? null : p.image_url;
          this.projects.push(p);
          // Check format of team
          p.team = (typeof p.team === 'string') ?
            p.team.replaceAll(",", " ").replaceAll("  ", " ").split(" ") : p.team;
        });

        // Sort by name
        // this.projects.sort((a, b) => a.name.localeCompare(b.name));

        // Sort by score
        this.projects.sort((a, b) => a.score < b.score);

        // Sort out challenges
        //this.projects.sort((a, b) => a.is_challenge || b.is_challenge);
      })
      .catch((error) => {
        this.errorMessage = error;
      });
  },
  methods: {
    // Helper link to join a project team
    joinTeam: function (project) {
      window.open(project.url); // + "/star");
    },
    seeDetails: function (project) {
      window.open(project.url);
    },
    shareUrl: function () {
      return '?' +
        (this.isHexagons ? '&hexagons=1' : '') +
        (this.isPreviews ? '&previews=1' : '') +
        (this.isButtons ? '&buttons=1' : '') +
        (this.isChallenges ? '&challenges=1' : '') +
      '';
    }
  },
};
</script>

<style scoped>
.challenges {
  padding: 20px 38px;
  box-sizing: border-box;
  color: #263238;
}
.options {
  margin: 1em;
  font-size: 90%;
  opacity: 0.2;
  cursor: pointer;
}
.options:hover {
  opacity: 1;
}
.options label {
  margin-right: 1em;
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
}
.col[challenge].project-container .team-stats {
  display: none;
}
.project-container {
  display: inline-block;
  background-size: 100% auto;
  background-repeat: no-repeat;
  padding: 0px;
}
.project {
  display: block;
  text-align: left;
  width: auto;
  margin: 0px;
  padding: 0.5em 1em;
  background: rgba(255, 255, 255, 1);
  margin-top: 25%;
  min-height: 8em;
}
.project.has-thumb {
  /* border-left: 1px solid #ddd; */
}
.project .status {
  font-size: 75%;
  font-family: serif;
}
.project .name {
  color: #0089c7;
  font-weight: bold;
  font-size: 110%;
  display: block;
  margin-top: 0.5em;
  margin-bottom: 1em;
  text-decoration: none;
}
.project .name .hex {
  -webkit-transform: rotate(30deg);
  transform: rotate(30deg);
  display: inline-block;
  opacity: 0.4;
  float: right;
  margin-top: -0.8em;
  margin-right: -0.6em;
}
.project .team-stats {
  float: left;
  font-size: 80%;
  color: #999;
  width: 2em;
  text-align: center;
  margin: 0.5em 1em 2em -0.3em;
}
.project a:hover {
  color: blue;
}
.summary, .excerpt {
  text-align: left;
  color: black;
  font-size: 85%;
  line-height: 140%;
  white-space: pre-wrap;
  white-space: -moz-pre-wrap;
  white-space: -pre-wrap;
  white-space: -o-pre-wrap;
  word-wrap: break-word;
}
.summary {
  text-align: left;
  margin: 0px;
  padding: 0px;
  position: absolute;
  display: inline-block;
  top: 6px;
  left: 0px;
  width: 100%;
}
.summary p {
  margin: 0.5em 1em ;
  padding: 1em;
  background: #ffc;
  display: inline-block;
}
.excerpt {
  overflow: hidden;
  width: 100%;
  padding: 0px;
  margin-bottom: 1em;
  border-top: 1px solid lightgray;
  border-bottom: 1px solid lightgray;
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
.team-roster .avatar {
  max-height: 2em;
  display: inline-block;
  color: black;
  background: none; /* rgba(0, 0, 0, 0.1); */
  border: 2px solid #fff;
  margin-right: .8em;
  line-height: 1.5em;
  text-align: left;
  text-decoration: none;
  font-size: 80%;
  font-family: serif;
}
.join {
  clear: both;
  display: block;
  text-align: center;
  margin-bottom: 1em;
}
.join button:hover {
  background: #fff;
  border: 1px solid blue;
}
.join button {
  cursor: pointer;
  display: inline-block;
  margin: 0px 0.25em;
  font-size: 105%;
  background: #eee;
  padding: 0.4em;
  line-height: 1.5em;
  border: 1px dashed #444;
  border-radius: 10px;
  opacity: 0.8;
}


/* ---- Hexagonal hawtness ---- */

.honeycomb {
  width: 760px;
  min-height: 700px;
  text-align: left;
  margin: 0 auto;
}
@media (max-width: 980px) {
  .honeycomb {
    width: auto;
    /* left: inherit; */
  }
}
@media (max-width: 420px) {
  .honeycomb .hexagon {
    margin-bottom: auto;
    top: auto;
  }
  .honeycomb {
    clear: both;
  }
}

.challenge.hexagon .hexagontent {
  color: #35a;
  font-weight: normal;
  padding: 4px 0px;
}
.challenge.hexagon {
  background-color: white;
  border-top: 1px dashed rgba(0,0,200,0.4);
  border-bottom: 1px dashed rgba(0,0,200,0.4);
}
.challenge.hexagon::before {
  border-top: 1px dashed rgba(0,0,200,0.4);
  border-bottom: 1px dashed rgba(0,0,200,0.4);
}
.challenge.hexagon::after {
  border-top: 1px dashed rgba(0,0,200,0.4);
  border-bottom: 1px dashed rgba(0,0,200,0.4);
}
.challenge.hexagon:hover {
  box-shadow: none;
}

.project .hexagontent {
  overflow: hidden;
  color: black;
  line-height: 1.5;
}
.project .hexagontent.with-icon div {
  font-size: 90%;
}
.project .hexagontent div {
  max-height: 5.4em;
}
.project .hexagontent .fa {
  font-size: 240%;
}
.project .hexagontent .progress {
  margin-top: 1em;
  margin-bottom: 0px;
  height: 3px;
  position: relative;
  width: 72px;
  margin-left: -36px;
  left: 50%;
  opacity: 1;
  border: 1px solid white;
}
.project .hexagontent .progress-bar {
  background-color: #aaa;
}
.honeycomb .project { opacity: 0.4; }

.hexagon {
  position: relative;
  display: inline-block;
  /* left/right margin approx. 25% of .hexagon width + spacing */
  margin: 1px 21px;
  background-color: white;
  text-align: center;
}
.hexagon, .hexagon::before, .hexagon::after {
  /* easy way: height is width * 1.732
  actual formula is 2*(width/(2*Math.tan(Math.PI/6)))
  remove border-radius for straight edges on hexagons */
  width: 82px;
  height: 142px;
  border-radius: 20%/5%;
}
.hexagon::before {
  background-color: inherit;
  content: "";
  position: absolute;
  left: 0;
  transform: rotate(-60deg);
}
.hexagon::after {
  background-color: inherit;
  content: "";
  position: absolute;
  left: 0;
  transform: rotate(60deg);
}
.hexagon:nth-child(even) {
  /* top approx. 50% of .hexagon height + spacing */
  top: 73px;
}
.hexagon:hover {
  background-color: hsla(60, 75%, 75%, 1.0);
  cursor: pointer;
  z-index: 105;
}
.hexagon:active {
  background-color: hsla(60, 75%, 50%, 1.0);
  z-index: 110;
}
.hexagontent {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 140%;
  font-size: 1.0rem;
  line-height: 1.2;
  z-index: 100;
}
.ibws-fix {
  /* inline-block whitespace fix */
  font-size: 0;
}
.hexagon .project { display: none; }
.share-button a {
  text-decoration: none;
  margin-left: 0.3em;
}
</style>
