<template>
  <div class="challenges card">
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
            <a class="name" :href="project.url" target="_blank">{{
              project.name
            }}</a>
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
            <div class="rollup">
              <p class="summary">{{ project.summary }}</p>
              <markdown class="excerpt" :source="project.excerpt" />
              <div class="join">
                <button @click="seeDetails(project)">🕮 Details</button>
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
    };
  },
  mounted() {
    if (this.projects !== null) return;
    console.info("Loading", this.src);
    fetch(this.src)
      .then(async (response) => {
        const data = await response.json();

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

        if (data.resources !== 'null') {
          data.projects = data.resources[1].data;
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
          p.team = (typeof p.team === 'string') ? p.team.split(" ") : p.team;
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
    // Loads full details of a project (CURRENTLY UNUSED)
    showDetails: function (project) {
      let self = this;
      let url =
        project.url.replace("/project/", "/api/project/") + "/info.json";
      fetch(url)
        .then(async (response) => {
          const data = await response.json();

          // check for error response
          if (!response.ok) {
            // get error message from body or default to response statusText
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
          }

          console.log(data);
          self.projects.forEach((p) => {
            if (p.id !== data.project.id) return;
            p.team = (typeof data.team === 'string') ? data.team.split(" ") : data.team;
          });
        })
        .catch((error) => {
          this.errorMessage = error;
        });
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
.col[challenge] {
  opacity: 0.8;
}
.card {
  border-radius: 2px;
  box-sizing: border-box;
  margin-bottom: 50px;
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
}
.project.has-thumb {
  border-left: 1px solid #ddd;
  margin-top: 25%;
}
.project .name {
  font-weight: bold;
  color: black;
  text-decoration: none;
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
.excerpt {
  font-size: 70%;
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
  max-height: 500px;
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
  text-align: left;
  text-decoration: none;
  font-size: 70%;
  font-family: cursive;
}
.team .join {
  clear: both;
  display: block;
  text-align: center;
}
button {
  cursor: pointer;
  margin-right: 0.5em;
}
</style>
