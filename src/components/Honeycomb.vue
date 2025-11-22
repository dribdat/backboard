<template>
  <div class="honeycomb">
      <div
        v-for="project in projects"
        :key="project.id"
        :class="'hexagon ' + getHexagonClass(project)"
        :challenge="project.is_challenge"
        :style="project.logo_color ? ('border-width: 3px; border-color:' + project.logo_color) : ''"
        :title="project.summary"
        @click="$emit('preview', project)"
      >
        <div class="hexagontent">
          <div class="name">
            <span v-if="project.name.length > 30" class="padme"></span>
            {{ project.name }}
          </div>
          <div v-if="project.ident" class="ident">{{ fitme(project.ident) }}</div>
          <div v-if="project.image_url" class="hexaicon"
              :style="'background-image:url(' + project.image_url + ')'"></div>
              <div class="progress"
                v-if="!project.is_challenge && project.score && project.score > 0 && project.score < 80">
                <div class="progress-bar" role="progressbar"
                  :style="'width:' + project.score + '%'">
                </div>
              </div>
          </div>
      </div>
    </div>
</template>
<script>
export default {
  name: "ProjectHoneycomb",
  props: {
    projects: Array
  },
  methods: {
    fitme: (text) => {
      return text.substr(0, 7)
    },
    getHexagonClass: (project) => {
      return (project.is_challenge ? 'challenge' : 'project') +
             (project.progress ? ' stage-' + project.progress : '')
    }
  }
}
</script>

<style scoped>

/* ---- Hexagonal hawtness ---- */

.honeycomb {
  width: 760px;
  margin: 0 auto 120px auto;
  text-align: left;
  line-height: 0px;
  clear: both;
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

@media (min-width: 452px) and (max-width: 595px) {
  .honeycomb {
    width:360px;
  }
}
@media (min-width: 707px) and (max-width: 847px) {
  .honeycomb {
    width:600px;
  }
}

.padme {
  display: inline-block;
  width: 0.1em; height: 1em;
  visibility: hidden;
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

.hexagon .hexagontent .name {
  max-height: 4.5em;
  overflow: hidden;
  display: block;
}

.project.hexagon  .hexagontent {
  overflow: hidden;
  color: black;
  margin-top: 0.2em;
}
.project .hexagontent.with-icon div {
  font-size: 90%;
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
  border: 1px solid rgba(0,0,0,0.1);
}
.project .hexagontent .progress-bar {
  background-color: rgba(0,0,0,0.2);
  height: 3px;
}
.project.hexagon {
  border-top: 1px solid rgba(0,0,0,0.2);
  border-bottom: 1px solid rgba(0,0,0,0.2);
}
.project.hexagon::before {
  border-top: 1px solid rgba(0,0,0,0.2);
  border-bottom: 1px solid rgba(0,0,0,0.2);
}
.project.hexagon::after {
  border-top: 1px solid rgba(0,0,0,0.2);
  border-bottom: 1px solid rgba(0,0,0,0.2);
}

/* --- Hexagon default palette --- */
.project.hexagon  { background-color: #ebd8c3; } /* primary color */
.hexagon.stage-5  { background-color: #ebd8c3; }
.hexagon.stage-10 { background-color: #ffeeba; }
.hexagon.stage-20 { background-color: #ffd9ba; }
.hexagon.stage-30 { background-color: #ffe7ba; }
.hexagon.stage-40 { background-color: #fff5ba; }
.hexagon.stage-50 { background-color: #fbffba; }
/* hhttps://colorkit.co/palette/ffeeba-ffd9ba-ffe7ba-fff5ba-fbffba/ */

.hexagon .hexagontent {
  color: #139;
  font-weight: normal;
  padding: 4px 0px;
  max-height: 120px;
  line-height: 13pt;
  font-size: 1.0rem;
  text-shadow: 1px 1px 1px #fff;
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: transparent;
}
.hexagontent .ident {
  font-weight: bold;
  font-size: 90%;
  text-shadow: 2px 1px 1px white;
  color: #777;
  font-family: monospace;
  line-height: 0em;
  margin: 2.2em 0 0 -2.4em;
  padding: 0px;
  position: absolute;
  text-align: center;
  width: 100%;
  z-index: 2;
}
.hexagon .hexaicon {
  width: 2em;
  height: 2em;
  background-color: white;
  background-size: cover;
  position: relative;
  left: 50%;
  margin: 1em 0 0 -1em;
  box-shadow: -2px -2px 1px rgb(0 0 0 / 20%);
  border-radius: 1em;
}

.hexagon {
  position: relative;
  display: inline-block;
  /* left/right margin approx. 25% of .hexagon width + spacing */
  margin: 2px 22px;
  background-color: white;
  text-align: center;
  padding: 0px;
  box-shadow: 0px 2px 4px rgba(0,0,0,0.3);
}
.hexagon, .hexagon::before, .hexagon::after {
  /* easy way: height is width * 1.732
  actual formula is 2*(width/(2*Math.tan(Math.PI/6)))
  remove border-radius for straight edges on hexagons */
  width: 82px;
  height: 142px;
  border-radius: 20%/5%;
}
.project.hexagon, .project.hexagon::before, .project.hexagon::after {
  border-color: transparent !important;
  border-top: none;
  border-bottom: none;
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
  background-color: hsla(60, 75%, 75%, 1.0) !important;
  box-shadow: 5px 5px 25px rgba(0,0,0,0.2);
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
</style>