<template>
  <q-page class="flex row q-pa-md">
    <circular-progress v-if="displayLoading" />

    <p v-if="displayError" class="text-body1 text-red">{{displayError}}</p>

    <q-form
      @submit="onSubmit"
      class="q-gutter-md full-width"
      :greedy="true"
      v-if="!displayLoading && !displayError"
    >
      <p class="text-h4 q-mb-md">{{display ? 'Edit' : 'New'}} Display</p>

      <q-input
        style="width: 40%"
        outlined
        v-model="name"
        label="Display Name"
        :rules="[name => !!name]"
      />

      <q-input
        style="width: 40%"
        outlined
        v-model="loginName"
        label="Login Name"
        :rules="[loginName => !!loginName]"
      />


      <div class="row q-mb-md">
        <p class="text-h4 q-ma-none">Slides</p>
        <q-btn flat color="grey" icon="edit" @click="editSlides" />
      </div>

      <slide-list :deletable="false" :slides="slides || []" />

      <q-dialog v-model="slidesDialogVisible">
        <slides-selector
          class="full-width slides-dialog"
          v-model="slides"
          @close="slidesDialogVisible = false"
        />
      </q-dialog>

      <p v-if="createError" class="text-body1 text-red">{{createError}}</p>

      <div>
        <q-btn label="Save" type="submit" :loading="createLoading || updateLoading" color="primary"/>
        <q-btn
          flat
          label="Cancel"
          color="primary"
          to="/admin/displays"
          class="q-ml-sm"
          :disable="createLoading || updateLoading"
        />
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import * as api from 'src/api'
import useAsync from 'src/composables/use-async'
import useErrorMessage from 'src/composables/use-error-message'
import CircularProgress from 'src/components/CircularProgress.vue'
import SlidesSelector from 'src/components/SlidesSelector.vue'
import SlideList from 'src/components/SlideList.vue'

export default defineComponent({
  components: { SlidesSelector, SlideList, CircularProgress },
  setup() {
    const name = ref(null);
    const loginName = ref(null);
    const slides = ref(null);
    const slidesDialogVisible = ref(false)
    const route = useRoute();
    const router = useRouter();
    const {
      data: display,
      loading: displayLoading,
      error: displayError,
      doAsync: getDisplay
    } = useAsync(api.getDisplay);
    const {
      data: createResponse,
      loading: createLoading,
      error: createError,
      doAsync: createDisplay
    } = useAsync(api.createDisplay);
    const {
      data: updateResponse,
      loading: updateLoading,
      error: updateError,
      doAsync: updateDisplay
    } = useAsync(api.updateDisplay)

    const onSubmit = async () => {
      if (!display.value) {
        createDisplay({
          name: name.value,
          loginName: loginName.value,
          slides: (slides.value || []).map(slide => slide.id)
        })
      } else {
        const update = {}

        if (loginName.value) {
          update.loginName = loginName.value
        }

        if (name.value) {
          update.name = name.value
        }

        if (slides.value) {
          update.slides = slides.value.map(slide => slide.id)
        }

        updateDisplay(display.value.id, update)
      }
    }

    const editSlides = () => {
      slidesDialogVisible.value = true
    }

    watch(createResponse, () => {
      router.push('/admin/displays')
    })

    watch(updateResponse, () => {
      router.push('/admin/displays')
    })

    watch(display, () => {
      if (display.value) {
        name.value = display.value.name
        loginName.value = display.value.loginName
        slides.value = display.value.slides
      }
    })

    onMounted(() => {
      if (route.params.id) {
        getDisplay(route.params.id)
      }
    })

    return {
      name,
      loginName,
      slides,
      onSubmit,
      display,
      displayLoading,
      displayError: useErrorMessage(displayError),
      createLoading,
      createError: useErrorMessage(createError),
      slidesDialogVisible,
      editSlides,
      updateLoading,
      updateError: useErrorMessage(updateError)
    }
  },
})
</script>

<style scoped>
  .slides-dialog {
    max-width: none;
  }
</style>
