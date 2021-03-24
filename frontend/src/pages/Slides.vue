<template>
  <q-page class="flex row q-pa-md position-relative">
    <circular-progress v-if="loading" />

    <p v-if="error" class="text-body1 text-red">{{error}}</p>

    <p
      v-if="slides && slides.length === 0"
      class="text-subtitle1 text-grey-6 full-width text-center"
    >
      No Slides
    </p>

    <slide-list
      class="full-width"
      v-if="slides"
      :deletable="true"
      :deletingId="deletingSlide"
      :slides="slides"
      @click="onClick"
      @delete="onDelete"
    />

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" to='/admin/slides/new' />
    </q-page-sticky>
  </q-page>
</template>

<script>
import { defineComponent, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import * as api from '../api'
import useAsync from '../composables/use-async'
import useErrorMessage from 'src/composables/use-error-message'
import CircularProgress from 'src/components/CircularProgress.vue'
import SlideList from 'src/components/SlideList.vue'

export default defineComponent({
  components: {
    CircularProgress,
    SlideList,
  },
  setup() {
    const router = useRouter()
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

    const onClick = (slide) => {
      router.push(`/admin/slides/${slide.id}`)
    }

    const onDelete = (slide) => {
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
