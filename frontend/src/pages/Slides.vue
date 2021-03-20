<template>
  <q-page class="flex row">
    <q-circular-progress
      indeterminate
      v-if="loading"
      size="50px"
      color="primary"
      class="q-ma-md"
    />

    <q-list v-if="slides" class="col-8">
      <q-item
        clickable
        v-ripple
        v-for="slide in slides"
        :key="slide.id"
      >
        <q-item-section thumbnail>
          <img :src="slide.url" class="thumbnail">
        </q-item-section>
        <q-item-section class="text-h4">{{ slide.name }}</q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import * as api from '../api'
import useAsync from '../composables/use-async'

export default defineComponent({
  setup() {
    const { data: slides, loading, error, doAsync: getSlides } = useAsync(api.getSlides);

    getSlides();

    return { slides, loading, error }
  },
})
</script>

<style scoped>
  .thumbnail {
    width: auto;
    height: 200px;
  }
</style>
