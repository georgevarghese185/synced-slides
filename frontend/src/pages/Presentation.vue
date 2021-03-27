<template>
  <q-page class="flex column items-center justify-center">

    <div v-if="!presenting">
      <circular-progress v-if="loading" />
      <p v-if="connectionError" class="text-body1 text-red">Connection error: {{connectionError}}</p>
      <p v-if="error" class="text-body1 text-red">{{error}}</p>
      <p v-if="display" class="text-h3">{{display.name}}</p>
      <q-btn
        :disable="!display || !connected"
        label="Start Presentation"
        color="primary"
        @click="startPresentation"
      />
    </div>

    <div
      v-if="presenting && connected && slideNumber != null"
      class="absolute-full"
    >
      <img
        v-for="slide in slides"
        :key="slide.id"
        :src="slide.url"
        :class="slideClass(slide)"
      />
    </div>
  </q-page>
</template>

<script>
import useAsync from 'src/composables/use-async'
import useErrorMessage from 'src/composables/use-error-message'
import { defineComponent, onMounted, onUnmounted, ref, computed } from 'vue'
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

    const slides = computed(() => {
      if (!display.value && !connected.value) {
        return [];
      }

      return [
        display.value.slides[slideNumber.value - 1],
        display.value.slides[slideNumber.value],
        display.value.slides[slideNumber.value + 1]
      ].filter(slide => !!slide)
    })

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

    const slideClass = (slide) => {
      const index = display.value.slides.findIndex(s => s.id === slide.id)
      return {
        slide: true,
        'absolute-full': true,
        'slide-previous': index < slideNumber.value,
        'slide-next': index > slideNumber.value
      }
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
      slides,
      slideNumber,
      presenting,
      display,
      loading,
      error: useErrorMessage(error),
      startPresentation,
      slideClass
    }
  },
})
</script>

<style scoped>
  .slide {
    height: 100%;
    width: 100%;
    object-fit: contain;
    transition: transform 1s ease;
  }

  .slide-previous {
    transform: translate(-100%, 0);
  }

  .slide-next {
    transform: translate(100%, 0);
  }
</style>
