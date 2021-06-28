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
            <p class="summary">{{ project.summary }}</p>
            <div class="team" v-show="project.team.length > 0">
              <a
                v-for="user in project.team"
                :key="user"
                :href="baseUrl + user"
                target="_blank"
                class="avatar"
                >👤
                <span>{{ user }}</span>
              </a>
            </div>
            <div class="join">
              <button @click="joinTeam(project)">👍 Join</button>
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

export default {
  name: "ChallengeGrid",
  props: {
    src: String,
  },
  components: {
    row: Row,
    column: Column,
  },
  data() {
    return {
      baseUrl: null,
      projects: null,
      errorMessage: null,
    };
  },
  mounted() {
    if (this.projects !== null) return;
    this.baseUrl = this.src.replace(/(.*)\/api\/.*/, "$1/user/");
    fetch(this.src)
      .then(async (response) => {
        const data = await response.json();

        // check for error response
        if (!response.ok) {
          // get error message from body or default to response statusText
          const error = (data && data.message) || response.statusText;
          return Promise.reject(error);
        }

        //console.info("Projects data loaded");
        this.projects = [];
        data.projects.forEach((p) => {
          // Assign a boolean for challenge status
          p.is_challenge = p.progress < 0;
          // Ensure image_url attribute always present
          p.image_url = typeof p.image_url === "undefined" ? null : p.image_url;
          this.projects.push(p);
        });

        // Sort alphabetically by name
        this.projects.sort((a, b) => a.name.localeCompare(b.name));

        // Sort challenges to bottom
        this.projects.sort((a, b) => a.is_challenge || b == null);
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
    // Loads full details of a project
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
            p.team = data.team;
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
  display: inline-block;
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
.summary {
  text-align: left;
  font-size: 80%;
  line-height: 140%;
  white-space: pre-wrap;
  white-space: -moz-pre-wrap;
  white-space: -pre-wrap;
  white-space: -o-pre-wrap;
  word-wrap: break-word;
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
}
</style>
