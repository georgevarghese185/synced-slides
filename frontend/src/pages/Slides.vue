<template>
  <q-page class="flex row q-pa-md">
    <q-circular-progress
      indeterminate
      v-if="loading"
      size="50px"
      color="primary"
      class="q-ma-md"
    />

    <p v-if="error" class="text-body1 text-red">{{error}}</p>

    <p
      v-if="slides && slides.length === 0"
      class="text-subtitle1 text-grey-6 full-width text-center"
    >
      No Slides
    </p>

    <q-list v-if="slides" class="full-width">
      <q-item
        clickable
        v-ripple
        v-for="slide in slides"
        :key="slide.id"
        @click="onClick(slide)"
      >
        <q-item-section thumbnail>
          <img :src="slide.url" class="thumbnail">
        </q-item-section>
        <q-item-section class="text-h6">{{ slide.name }}</q-item-section>
        <div class="column justify-center">
          <q-btn
            flat
            color="red"
            icon="delete"
            :loading="deleteLoading && deletingSlide === slide.id"
            @click="onDelete(slide, $event)"
          />
        </div>
      </q-item>
    </q-list>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" to='/admin/slides/new' />
    </q-page-sticky>
  </q-page>
</template>

<script>
import { defineComponent, onMounted, ref, watch } from 'vue'
import * as api from '../api'
import useAsync from '../composables/use-async'
import useErrorMessage from 'src/composables/use-error-message'

export default defineComponent({
  setup() {
    const {
      data: slides,
      loading,
      error,
      doAsync: getSlides
    } = useAsync(api.getSlides);
    const {
      data: deleteResponse,
      loading: deleteLoading,
      doAsync: deleteSlide
    } = useAsync(api.deleteSlide);
    const deletingSlide = ref(null)

    const onClick = (slide, e) => {

    }

    const onDelete = (slide, e) => {
      e.stopPropagation()
      deletingSlide.value = slide.id
      deleteSlide(slide.id)
    }

    onMounted(getSlides)
    watch(deleteResponse, getSlides)

    return {
      slides,
      loading,
      deleteLoading,
      deletingSlide,
      error: useErrorMessage(error),
      onClick,
      onDelete
    }
  },
})
</script>

<style scoped>
  .thumbnail {
    width: auto;
    height: 200px;
  }
</style>
