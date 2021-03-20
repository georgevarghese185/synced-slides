<template>
  <q-page class="flex row q-pa-md">
    <q-form
      @submit="onSubmit"
      class="q-gutter-md col-5"
    >
      <p class="text-h4 q-mb-xl">New Slide</p>

      <img v-if="preview" :src="preview" class="preview"/>

      <q-file
        outlined
        name="image"
        label="Image"
        v-model="image"
        accept="image/*"
      >
        <template v-slot:prepend>
          <q-icon name="attach_file" />
        </template>
      </q-file>

      <q-input outlined v-model="name" label="Slide Name" />

      <div>
        <q-btn label="Save" type="submit" color="primary"/>
        <q-btn label="Cancel" color="primary" to="/admin/slides" flat class="q-ml-sm" />
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed, watch } from 'vue'

export default defineComponent({
  setup() {
    const image = ref(null);
    const name = ref(null);
    const preview = computed(() => {
      if (image.value) {
        return URL.createObjectURL(image.value);
      } else {
        return null;
      }
    });

    const onSubmit = () => {

    }

    return { image, name, preview, onSubmit }
  },
})
</script>

<style scoped>

.preview {
  width: auto;
  height: 340px;
}

</style>
