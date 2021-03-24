<template>
  <q-page class="flex column q-pa-md">
    <p v-if="connectionError" class="text-body1 text-red">Connection error: {{connectionError}}</p>

    <div v-if="!connected && !connectionError" class="row">
      <p class="col text-h4"> Connecting </p>
      <q-circular-progress size="18px" :indeterminate="true" />
    </div>

    <p v-if="connected" class="text-h4">Now showing slide: {{slideNumber + 1}}</p>

    <div class="row q-gutter-md">
      <q-btn
        label="Previous"
        :disable="!connected || changingSlide"
        color="primary"
        @click="previousSlide"
      />
      <q-btn
        label="Next"
        :disable="!connected || changingSlide"
        color="primary"
        @click="nextSlide"
      />
      <q-circular-progress size="18px" :indeterminate="true" v-if="changingSlide"/>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import useSocket from 'src/composables/use-socket'
import useErrorMessage from 'src/composables/use-error-message'

export default defineComponent({
  setup() {
    const {
      connected,
      connectionError,
      slideNumber,
      changingSlide,
      nextSlide,
      previousSlide
    } = useSocket()

    return {
      connected,
      connectionError: useErrorMessage(connectionError),
      slideNumber,
      changingSlide,
      nextSlide,
      previousSlide,
    }
  },
})
</script>
