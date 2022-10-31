<template>
  <div class="challenges">
    <row container :gutter="20" v-if="!isHexagons">
      <column
        :xs="12"
        :md="4"
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
          v-show="isChallenges || !project.is_challenge"
        >
          <div :class="project.image_url ? 'project has-thumb' : 'project'"
               @click="seePreview(project)"
          >

            <div class="status">
              <b class="phase">{{ project.phase }}</b>
              /
              <span class="date">{{ project.date }}</span>
            </div>

            <div class="name">
              {{ project.name }}
            </div>

            <div class="team-stats" v-show="!project.is_challenge"
                  :title="project.team.join(', ')">
              <div class="team-counter" v-show="project.team.length > 1">
                <span class="hex">👤</span>
                <div class="count">{{ project.team.length }}</div>
              </div>
              <div class="score-counter" v-show="project.score > 0">
                <span class="hex">&#11042;</span>
                <div class="count">{{ project.score }}</div>
              </div>
            </div>

            <div v-show="project.summary || !project.is_challenge" class="summary">
              <p>{{ project.summary }}</p>
            </div>

            <div class="team-join" v-if="isButtons">
              <button @click="joinTeam(project)">👍 Join</button>
              <button v-show="project.contact_url" @click="contactTeam(project)">👋 Contact</button>
            </div>

          </div>
        </div>
      </column>
    </row>

    <div v-for="project in projects" :key="project.id">
      <Modal v-if="isPreviewActive == project.id" @close="isPreviewActive = false">
        <div slot="title">{{ project.name }}</div>
        <div class="content" slot="body">
          <markdown class="preview" :source="project.longtext || project.excerpt" :html="true" />
        </div>
        <div class="footer" slot="footer">
          <button class="nav nav-prev" @click="goPrev(project)">&lt;--</button>
          <button @click="seeDetails(project)">🕮 Project Page</button>
          <button class="nav nav-next" @click="goNext(project)">--&gt;</button>
        </div>
      </Modal>
    </div>

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

    <div class="options" v-show="toolbar">
      <input type="checkbox" v-model="isPreviews" id="isPreviews">
        <label for="isPreviews">Previews</label>
      <input type="checkbox" v-model="isButtons" id="isButtons">
        <label for="isButtons">Buttons</label>
      <input type="checkbox" v-model="isChallenges" id="isChallenges">
        <label for="isChallenges">Show Challenges</label>
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

import Modal from "./Modal"

export default {
  name: "ChallengeGrid",
  props: {
    src: String,
    toolbar: Boolean
  },
  components: {
    row: Row,
    column: Column,
    markdown: VueMarkdown,
    Modal,
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
      isPreviewActive: false,
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
        } else {
          this.profileUrl = window.location.href;
          console.warn("Using default profile:", this.profileUrl);
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

        // TODO: own configuration, issue with challenge order
        /*if (this.isButtons) {
          // Sort by name
          this.projects.sort((a, b) => a.name.localeCompare(b.name));
        } else {*/
          // Sort by score
          this.projects.sort((a, b) => a.score < b.score);
        //}
        // Sort out challenges
        //this.projects.sort((a, b) => a.is_challenge || b.is_challenge);

        // Try to set title from data package
        if (data.title) {
          document.title = data.title;
        } else if (data.projects.length > 0) {
          document.title = data.projects[0].event_name;
        }
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
    contactTeam: function (project) {
      window.open(project.contact_url);
    },
    seeDetails: function (project) {
      window.open(project.url);
    },
    seePreview: function (project) {
      if (!this.isPreviews) {
        return this.seeDetails(project);
      }
      this.isPreviewActive = (this.isPreviewActive == project.id) ?
                              false : project.id;
    },
    shareUrl: function () {
      return '?' +
        (this.isHexagons ? '&hexagons=1' : '') +
        (this.isPreviews ? '&previews=1' : '') +
        (this.isButtons ? '&buttons=1' : '') +
        (this.isChallenges ? '&challenges=1' : '') +
      '';
    },
    letsGo: function () {
      let theProjects = this.projects;
      let isChallenges = this.isChallenges;
      let curProjectId = this.isPreviewActive;
      if (curProjectId === false) return;
      let prev_item = false, prev = null, next = null;
      theProjects.forEach(function(p) {
        if (!isChallenges && p.is_challenge) return;
        if (next) return;
        if (prev !== null) { next = p.id; }
        if (curProjectId == p.id) { prev = prev_item; }
        prev_item = p.id;
      });
      return { 'prev': prev, 'next': next }
    },
    goNext: function() { this.isPreviewActive = this.letsGo().next },
    goPrev: function() { this.isPreviewActive = this.letsGo().prev }
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
  display: inline-block;
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
  float: right;
  display: inline-block;
  font-size: 80%;
  color: #999;
  width: 3em;
  text-align: center;
  margin: 0.5em -1em 0.5em 0;
}
.project .summary {
  min-height: 5em;
}

.preview, .summary, .excerpt {
  text-align: left;
  color: black;
  line-height: 140%;
}
.preview, .summary, .excerpt img {
  max-width: 100%;
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
button.nav-next {
  float: right;
}
button.nav-prev {
  float: left;
}
</style>
