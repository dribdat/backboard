<template>
  <transition name="modal">
    <div class="modal-mask"
        @click.self="$emit('close')">
      <div class="modal-wrapper" @click.self="$emit('close')">
        <div class="modal-container"
            :style="{ 'max-width': boxWidth + 'px' }"
            tabindex="1" ref="Container"
            @keydown.esc="$emit('close')"
            @keydown.left="$emit('prev')"
            @keydown.right="$emit('next')">
          <div class="modal-header">
            <slot name="header">
              <button class="modal-close-button"
                     @click="$emit('close')"
                     title="Close">
                <svg width="10mm" height="10mm" version="1.1" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg"><g transform="translate(-103.16 -124.46)" fill="#fff" stroke="#000"><path transform="matrix(.056913 0 0 .056913 104.99 125.34)" d="m94.181 139.24c-2.0027 1.1563-75.082 1.1563-77.085-1e-5 -2.0027-1.1563-38.543-64.445-38.543-66.758s36.54-65.601 38.543-66.758c2.0027-1.1563 75.082-1.1563 77.085 3.7e-6 2.0027 1.1563 38.543 64.445 38.543 66.758 0 2.3126-36.54 65.601-38.543 66.758z" stroke-width="7.2919"/><g transform="translate(.0216 .03025)" stroke-width=".31409"><path d="m106.61 127.86 3.0389 3.1489"/><path d="m106.61 131.01 3.0389-3.1489"/></g></g></svg>
              </button>
              <slot name="title"></slot>
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

      const tm = this.$refs.Container;
      this.$nextTick(() => { tm.focus(); });
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
  display: table;
  transition: opacity 0.3s ease;
  background-color: white;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: top;
}

.modal-container:focus-visible {
  outline: none;
}

.modal-container {
  margin: 0px auto;
  padding: 0px;
  width: 100%;
  background-color: #fff;
  color: #000;
  border-radius: 5px;
  /*
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);*/
  /*transition: all 0.3s ease;*/
  font-family: Helvetica, Arial, sans-serif;
  height: 100%;
}

@media (min-width: 768px) {
  .modal-container {
    height: 90%;
    padding: 30px 50px;
  }
  .dark .modal-mask {
    background-color: black;
  }
  .modal-close-button {
    margin-right: -5em;
    margin-top: 0em;
  }
}

.modal-body {
  width: 100%;
  margin: 10px 0;
  overflow-y: auto;
  overflow-x: hidden;
}

.preview img,
.modal-body img {
  max-width: 100%;
}

.modal-footer {
  bottom: 0%;
  position: fixed;
  right: 0px;
}

.modal-close-button {
  float: right;
  text-align: center;
  padding: 0px;
  line-height: 0px;
  position: relative;
  margin-right: -2em;
  margin-top: -2em;
  top: 1.44em;
}
@media (max-width: 768px) {
  button.modal-close-button {
    position: absolute;
    top: 2.3em;
    right: 2.1em;
    left: auto;
    display: block;
  }
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

/*
.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
*/
</style>
