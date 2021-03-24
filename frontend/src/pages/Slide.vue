<template>
  <q-page class="flex row q-pa-md">
    <circular-progress v-if="slideLoading" />

    <p v-if="slideError" class="text-body1 text-red">{{slideError}}</p>

    <q-form
      @submit="onSubmit"
      class="q-gutter-md col-5"
      :greedy="true"
      v-if="!slideLoading"
    >
      <p class="text-h4 q-mb-md">{{slide ? 'Edit' : 'New'}} Slide</p>

      <img v-if="preview" :src="preview" class="preview"/>

      <q-file
        outlined
        name="image"
        label="Image"
        v-model="image"
        accept="image/*"
        :rules="[file => !!slide || !!file]"
      >
        <template v-slot:prepend>
          <q-icon name="attach_file" />
        </template>
      </q-file>

      <q-input
        outlined
        v-model="name"
        label="Slide Name"
        :rules="[name => !!name]"
      />

      <p v-if="uploadError" class="text-body1 text-red">{{uploadError}}</p>

      <div>
        <q-btn label="Save" type="submit" :loading="uploadLoading || updateLoading" color="primary"/>
        <q-btn
          flat
          label="Cancel"
          color="primary"
          to="/admin/slides"
          class="q-ml-sm"
          :disable="uploadLoading || updateLoading"
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

const getImageBase64 = async (image) => {
  const fileReader = new FileReader();

  await new Promise(resolve => {
    fileReader.onload = resolve;
    fileReader.readAsDataURL(image);
  });

  return fileReader.result.replace(`data:${image.type};base64,`, "")
}

export default defineComponent({
  components: {
    CircularProgress
  },
  setup() {
    const image = ref(null);
    const name = ref(null);
    const route = useRoute();
    const router = useRouter();
    const {
      data: slide,
      loading: slideLoading,
      error: slideError,
      doAsync: getSlide
    } = useAsync(api.getSlide);
    const {
      data: uploadResponse,
      loading: uploadLoading,
      error: uploadError,
      doAsync: uploadSlide
    } = useAsync(api.uploadSlide);
    const {
      data: updateResponse,
      loading: updateLoading,
      error: updateError,
      doAsync: updateSlide
    } = useAsync(api.updateSlide)

    const preview = computed(() => {
      if (image.value) {
        return URL.createObjectURL(image.value);
      } else if (slide.value && slide.value.url) {
        return slide.value.url
      } else {
        return null;
      }
    });

    const onSubmit = async () => {
      if (!slide.value) {
        const type = image.value.type
        const data = await getImageBase64(image.value)
        uploadSlide({ name: name.value, type, data })
      } else {
        const update = {}

        if (image.value) {
          update.type = image.value.type
          update.data = await getImageBase64(image.value)
        }

        if (name.value) {
          update.name = name.value
        }

        updateSlide(slide.value.id, update)
      }
    }

    watch(uploadResponse, () => {
      router.push('/admin/slides')
    })

    watch(updateResponse, () => {
      router.push('/admin/slides')
    })

    watch(slide, () => {
      if (slide.value) {
        name.value = slide.value.name
      }
    })

    onMounted(() => {
      if (route.params.id) {
        getSlide(route.params.id)
      }
    })

    return {
      image,
      name,
      preview,
      onSubmit,
      slide,
      slideLoading,
      slideError: useErrorMessage(slideError),
      uploadLoading,
      uploadError: useErrorMessage(uploadError),
      updateLoading,
      updateError: useErrorMessage(updateError),
    }
  },
})
</script>

<style scoped>

.preview {
  width: auto;
  height: 340px;
}

</style>
