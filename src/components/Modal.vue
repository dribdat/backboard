<template>
  <transition name="modal" @keydown.esc="$emit('close')">
    <div class="modal-mask" @click.self="$emit('close')">
      <div class="modal-wrapper" @click.self="$emit('close')">
        <div class="modal-container" :style="{ 'max-width': boxWidth + 'px' }">
          <div class="modal-header">
            <slot name="header">
              <button class="modal-close-button" @click="$emit('close')">
                &#10060;
              </button>
              <h3><slot name="title"></slot></h3>
            </slot>
          </div>

          <div class="modal-body" :style="{ 'max-height': boxHeight + 'px' }">
            <slot name="body"></slot>
          </div>

          <div class="modal-footer">
            <slot name="footer"> </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    name: "Modal",
    data() {
      return {
        boxHeight: 640,
        boxWidth: 480
      }
    },
    methods: {
      getScreenHeight() {
        return (
          window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
        );
      },
      getScreenWidth() {
        return (
          window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
        );
      }
    },
    mounted() {
      this.boxHeight = this.getScreenHeight() * 0.8;
      this.boxWidth = this.getScreenWidth() * 0.8;
    }
  }
</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  color: #000;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
  overflow-y: auto;
  overflow-x: hidden;
  border-bottom:  1px solid lightgray;
}

.modal-close-button {
  float: right;
  text-align: center;
  padding-left: 0px;
  /*
  padding-right: 12px;
  width: 2em;*/
  margin-bottom: 0.5em;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>