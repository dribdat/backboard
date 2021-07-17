<template>
  <div class="challenges">
    <div class="options">
      <input type="checkbox" v-model="isExpanded" id="isExpanded"><label for="isExpanded">Expanded</label>
      <input type="checkbox" v-model="isPreviews" id="isPreviews"><label for="isPreviews">Previews</label>
    </div>
    <row container :gutter="12">
      <column
        :xs="12"
        :md="6"
        :lg="4"
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
        >
          <div :class="project.image_url ? 'project has-thumb' : 'project'">
            <a class="name" :href="project.url" target="_blank">
              <span class="hex">&#11042;</span>
              {{ project.name }}
            </a>
            <div :class="isExpanded ? '' : 'rollup'">
              <p v-show="project.summary" class="summary">{{ project.summary }}</p>
              <markdown v-show="isPreviews" class="excerpt" :source="project.excerpt" />
              <div class="team" v-show="project.team.length > 0">
                <a
                  v-for="user in project.team"
                  :key="user"
                  :href="profileUrl + user"
                  target="_blank"
                  class="avatar"
                  >👤
                  <span>{{ user }}</span>
                </a>
              </div>
              <div class="join">
                <button @click="seeDetails(project)">🕮 {{ project.phase }}</button>
                <button @click="joinTeam(project)">👍 Join</button>
              </div>
            </div>
          </div>
        </div>
      </column>
    </row>
    <div class="error" v-if="errorMessage">{{ errorMessage }}</div>
  </div>
</template>

<script>
import { Row, Column } from "vue-grid-responsive";

import VueMarkdown from '@adapttive/vue-markdown'

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
      isExpanded: false,
      isPreviews: false,
    };
  },
  mounted() {
    if (this.projects !== null) return;
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
          this.profileUrl = (data.homepage + '/user/').replace('//','/');
        }

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
          p.is_challenge = p.progress < 0;
          // Ensure image_url attribute always present
          p.image_url = typeof p.image_url === "undefined" ? null : p.image_url;
          this.projects.push(p);
          // Check format of team
          p.team = (typeof p.team === 'string') ?
            p.team.replaceAll(",", " ").replaceAll("  ", " ").split(" ") : p.team;
        });

        // Sort by name
        this.projects.sort((a, b) => a.name.localeCompare(b.name));

        // Sort by score
        //this.projects.sort((a, b) => a.score > b.score);

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
      window.open(project.url + "/star");
    },
    seeDetails: function (project) {
      window.open(project.url);
    },
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
  font-size: 125%;
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
  box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12),
    0 2px 4px -1px rgba(0, 0, 0, 0.3);
  border: 1px solid #eee;
}
.col:hover {
  border-color: #aaa;
}
.col[challenge].project-container {
  background: repeating-linear-gradient(
    45deg,
    #a0adcc,
    #a0adcc 10px,
    #fefefe 10px,
    #ffffff 20px
  );
}
.project-container {
  display: inline-block;
  background-size: 100% auto;
  background-repeat: no-repeat;
  padding: 0px;
}
.project {
  display: block;
  width: auto;
  margin: 0px;
  padding: 0.5em 1em;
  background: rgba(255, 255, 255, 1);
  margin-top: 25%;
}
.project.has-thumb {
  /* border-left: 1px solid #ddd; */
}
.project .name {
  font-weight: bold;
  font-size: 125%;
  display: block;
  margin-top: 0.5em;
  color: black;
  text-decoration: none;
}
.project .name .hex {
  -webkit-transform: rotate(30deg);
  transform: rotate(30deg);
  display: inline-block;
  opacity: 0.5;
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
  font-weight: bold;
  font-style: italic;
  text-align: center;
  margin: 1em 0em;
  padding: 1em 2em;
  background: #ffc;
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
.team .avatar {
  max-height: 2em;
  display: inline-block;
  color: darkblue;
  background: none; /* rgba(0, 0, 0, 0.1); */
  border: 2px solid #fff;
  padding: 0.5em;
  margin-right: 5px;
  margin-bottom: 5px;
  line-height: 0.8em;
  text-align: left;
  text-decoration: none;
  font-family: cursive;
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
</style>
