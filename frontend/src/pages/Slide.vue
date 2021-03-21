<template>
  <q-page class="flex row q-pa-md">
    <q-form
      @submit="onSubmit"
      class="q-gutter-md col-5"
      :greedy="true"
    >
      <p class="text-h4 q-mb-xl">New Slide</p>

      <img v-if="preview" :src="preview" class="preview"/>

      <q-file
        outlined
        name="image"
        label="Image"
        v-model="image"
        accept="image/*"
        :rules="[file => !!file]"
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

      <p v-if="error" class="text-body1 text-red">{{error}}</p>

      <div>
        <q-btn label="Save" type="submit" :loading="loading" color="primary"/>
        <q-btn
          flat
          label="Cancel" c
          olor="primary"
          to="/admin/slides"
          class="q-ml-sm"
          :disable="loading"
        />
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import * as api from 'src/api'
import useAsync from 'src/composables/use-async'
import useErrorMessage from 'src/composables/use-error-message'

export default defineComponent({
  setup() {
    const image = ref(null);
    const name = ref(null);
    const router = useRouter();
    const { data, loading, error, doAsync: uploadSlide } = useAsync(api.uploadSlide);

    const preview = computed(() => {
      if (image.value) {
        return URL.createObjectURL(image.value);
      } else {
        return null;
      }
    });

    watch(data, () => {
      router.push('/admin/slides')
    })

    const onSubmit = async () => {
      const fileReader = new FileReader();

      await new Promise(resolve => {
        fileReader.onload = resolve;
        fileReader.readAsDataURL(image.value);
      });

      const type = image.value.type
      const data = fileReader.result.replace(`data:${type};base64,`, "")

      uploadSlide({ name: name.value, type, data })
    }

    return {
      image,
      name,
      preview,
      onSubmit,
      data,
      loading,
      error: useErrorMessage(error)
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
