<template>
  <div class="fullscreen column items-center justify-center">
    <div v-if="!presenting">
      <circular-progress v-if="loading" />
      <p v-if="error" class="text-body1 text-red">{{error}}</p>
      <p v-if="display" class="text-h3">{{display.name}}</p>
      <q-btn
        v-if="display"
        label="Start Presentation"
        color="primary"
        @click="startPresentation"
      />
    </div>

    <img
      v-if="presenting && connected && slideNumber != null"
      :src="display.slides[slideNumber].url"
      class="slide"
    />
  </div>
</template>

<script>
import useAsync from 'src/composables/use-async'
import useErrorMessage from 'src/composables/use-error-message'
import { defineComponent, onMounted, onUnmounted, ref } from 'vue'
import * as api from 'src/api'
import CircularProgress from 'src/components/CircularProgress.vue'
import useSocket from 'src/composables/use-socket'

export default defineComponent({
  components: { CircularProgress },
  setup() {
    const presenting = ref(false)
    const {
      data: display,
      loading,
      error,
      doAsync: getMyDisplay
    } = useAsync(api.getMyDisplay)
    const {
      connected,
      connectionError,
      slideNumber,
    } = useSocket(getMyDisplay);

    const onFullscreenChange = () => {
      if (document.fullscreenElement == null) {
        presenting.value = false
        console.log('exiting fullscreen')
      }
    }

    const startPresentation = async () => {
      presenting.value = true
      // document.querySelector('#q-app').requestFullscreen();
    }

    onMounted(() => {
      getMyDisplay()
      document.onfullscreenchange = onFullscreenChange;
    })

    onUnmounted(() => {
      document.onfullscreenchange = null;
    })

    return {
      connected,
      connectionError,
      slideNumber,
      presenting,
      display,
      loading,
      error: useErrorMessage(error),
      startPresentation
    }
  },
})
</script>

<style scoped>
  .slide {
    height: 100%;
    width: auto;
  }
</style>
