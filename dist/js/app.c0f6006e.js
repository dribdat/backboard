(function(t){function e(e){for(var n,a,i=e[0],c=e[1],l=e[2],f=0,p=[];f<i.length;f++)a=i[f],Object.prototype.hasOwnProperty.call(s,a)&&s[a]&&p.push(s[a][0]),s[a]=0;for(n in c)Object.prototype.hasOwnProperty.call(c,n)&&(t[n]=c[n]);u&&u(e);while(p.length)p.shift()();return o.push.apply(o,l||[]),r()}function r(){for(var t,e=0;e<o.length;e++){for(var r=o[e],n=!0,i=1;i<r.length;i++){var c=r[i];0!==s[c]&&(n=!1)}n&&(o.splice(e--,1),t=a(a.s=r[0]))}return t}var n={},s={app:0},o=[];function a(e){if(n[e])return n[e].exports;var r=n[e]={i:e,l:!1,exports:{}};return t[e].call(r.exports,r,r.exports,a),r.l=!0,r.exports}a.m=t,a.c=n,a.d=function(t,e,r){a.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},a.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},a.t=function(t,e){if(1&e&&(t=a(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(a.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)a.d(r,n,function(e){return t[e]}.bind(null,n));return r},a.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return a.d(e,"a",e),e},a.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},a.p="/";var i=window["webpackJsonp"]=window["webpackJsonp"]||[],c=i.push.bind(i);i.push=e,i=i.slice();for(var l=0;l<i.length;l++)e(i[l]);var u=c;o.push([0,"chunk-vendors"]),r()})({0:function(t,e,r){t.exports=r("56d7")},"034f":function(t,e,r){"use strict";r("85ec")},"0b8c":function(t,e,r){},"1aac":function(t,e,r){"use strict";r("0b8c")},"446d":function(t,e,r){"use strict";r("bb09")},"56d7":function(t,e,r){"use strict";r.r(e);var n=r("2b0e"),s=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{attrs:{id:"app"}},[r("VoteBox",{staticClass:"votebox hidden",attrs:{href:"<URL OF VOTING FORM>"}}),r("ChallengeGrid",{attrs:{src:"https://hack.farming.opendata.ch/api/event/1/projects.json"}})],1)},o=[],a=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"challenges card"},[r("row",{attrs:{container:"",gutter:12}},t._l(t.projects,(function(e){return r("column",{key:e.id,attrs:{xs:12,md:6,lg:4}},[r("div",{staticClass:"col project-container",style:e.image_url?"background-image:url("+e.image_url+")":"",attrs:{challenge:e.is_challenge}},[r("div",{class:e.image_url?"project has-thumb":"project"},[r("a",{staticClass:"name",attrs:{href:e.url,target:"_blank"}},[t._v(t._s(e.name))]),r("p",{staticClass:"summary"},[t._v(t._s(e.summary))]),r("div",{directives:[{name:"show",rawName:"v-show",value:e.team.length>0,expression:"project.team.length > 0"}],staticClass:"team"},t._l(e.team,(function(e){return r("a",{key:e,staticClass:"avatar",attrs:{href:t.baseUrl+e,target:"_blank"}},[t._v("👤 "),r("span",[t._v(t._s(e))])])})),0),r("div",{staticClass:"join"},[r("button",{on:{click:function(r){return t.joinTeam(e)}}},[t._v("👍 Join")])])])])])})),1),t.errorMessage?r("div",{staticClass:"error"},[t._v(t._s(t.errorMessage))]):t._e()],1)},i=[],c=r("85db"),l={name:"ChallengeGrid",props:{src:String},components:{row:c["b"],column:c["a"]},data(){return{baseUrl:null,projects:null,errorMessage:null}},mounted(){null===this.projects&&(this.baseUrl=this.src.replace(/(.*)\/api\/.*/,"$1/user/"),fetch(this.src).then(async t=>{const e=await t.json();if(!t.ok){const r=e&&e.message||t.statusText;return Promise.reject(r)}this.projects=[],e.projects.forEach(t=>{t.is_challenge=t.progress<0,t.image_url="undefined"===typeof t.image_url?null:t.image_url,this.projects.push(t)}),this.projects.sort((t,e)=>t.name.localeCompare(e.name)),this.projects.sort((t,e)=>t.is_challenge||null==e)}).catch(t=>{this.errorMessage=t}))},methods:{joinTeam:function(t){window.open(t.url+"/star")},showDetails:function(t){let e=this,r=t.url.replace("/project/","/api/project/")+"/info.json";fetch(r).then(async t=>{const r=await t.json();if(!t.ok){const e=r&&r.message||t.statusText;return Promise.reject(e)}console.log(r),e.projects.forEach(t=>{t.id===r.project.id&&(t.team=r.team)})}).catch(t=>{this.errorMessage=t})}}},u=l,f=(r("1aac"),r("2877")),p=Object(f["a"])(u,a,i,!1,null,"299f6092",null),d=p.exports,h=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("section",[r("button",{on:{click:function(e){t.isVoteActive=!0}}},[t._v("🗳️ Vote now!")]),t.isVoteActive?r("Modal",{on:{close:function(e){t.isVoteActive=!1}}},[r("div",{staticClass:"content",attrs:{slot:"body"},slot:"body"},[r("iframe",{attrs:{src:t.framesrc,width:"100%",height:"460px",frameborder:"0",marginheight:"0",marginwidth:"0"}},[t._v("Loading…")])])]):t._e()],1)},m=[],g=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("transition",{attrs:{name:"modal"},on:{keydown:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"esc",27,e.key,["Esc","Escape"])?null:t.$emit("close")}}},[r("div",{staticClass:"modal-mask",on:{click:function(e){return e.target!==e.currentTarget?null:t.$emit("close")}}},[r("div",{staticClass:"modal-wrapper"},[r("div",{staticClass:"modal-container"},[r("div",{staticClass:"modal-header"},[t._t("header",(function(){return[r("button",{staticClass:"modal-close-button",on:{click:function(e){return t.$emit("close")}}},[t._v(" ❌ ")])]}))],2),r("div",{staticClass:"modal-body"},[t._t("body")],2),r("div",{staticClass:"modal-footer"},[t._t("footer")],2)])])])])},v=[],b=(r("446d"),{}),_=Object(f["a"])(b,g,v,!1,null,"41559bde",null),j=_.exports,y={name:"VoteBox",props:{href:String},components:{Modal:j},data(){return{framesrc:null,fullhref:null,isVoteActive:!1}},mounted(){let t=this.href;t=t.split("/"),t=t[t.length-2],t=t.split("?")[0],t="https://docs.google.com/forms/d/e/"+t,this.framesrc=t+"/viewform?embedded=true",this.fullhref=t+"?usp=sf_link"}},w=y,k=(r("d8f6"),Object(f["a"])(w,h,m,!1,null,"66984c73",null)),C=k.exports,x={name:"App",components:{ChallengeGrid:d,VoteBox:C}},O=x,M=(r("034f"),Object(f["a"])(O,s,o,!1,null,null,null)),P=M.exports;n["a"].config.productionTip=!1,new n["a"]({render:t=>t(P)}).$mount("#app")},"85ec":function(t,e,r){},bb09:function(t,e,r){},d8f6:function(t,e,r){"use strict";r("df15")},df15:function(t,e,r){}});
//# sourceMappingURL=app.c0f6006e.js.map