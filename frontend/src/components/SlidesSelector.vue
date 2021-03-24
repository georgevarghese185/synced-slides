<template>
  <q-card class="position-relative row">

    <div style="max-height: inherit;" class="col q-pa-sm overflow-auto">
      <circular-progress v-if="loading" />

      <p v-if="error" class="text-body1 text-red">{{error}}</p>

      <slide-list
        v-if="allSlides"
        :deletable="false"
        :slides="allSlides.filter(slide => !selectedSlides.find(s => s.id === slide.id))"
        @click="onSelect"
      />
    </div>

    <div style="max-height: inherit;" class="col q-pa-sm column">
      <q-card-section>
        <div class="text-h6">Selected</div>
      </q-card-section>

      <div class="col overflow-auto">
        <p
          v-if="selectedSlides.length === 0"
          class="text-subtitle1 text-grey-6 full-width text-center"
        >
          None
        </p>

        <slide-list
          v-if="allSlides"
          :deletable="true"
          :slides="selectedSlides"
          @delete="onRemove"
        />
      </div>

      <div class="q-mb-md">
        <q-btn label="Save" type="submit" color="primary" @click="onSave"/>
        <q-btn
          flat
          label="Cancel"
          color="primary"
          class="q-ml-sm"
          @click="onCancel"
        />
      </div>
    </div>
  </q-card>
</template>

<script>
import { defineComponent, onMounted, ref, computed, watch } from 'vue'
import * as api from 'src/api'
import useAsync from 'src/composables/use-async'
import SlideList from '../components/SlideList.vue'
import useErrorMessage from 'src/composables/use-error-message';

export default defineComponent({
  props: ['modelValue'],
  components: { SlideList },
  setup(props, { emit }) {
    const selectedSlides = ref(props.modelValue || [])
    const {
      data: allSlides,
      loading,
      error,
      doAsync: getSlides
    } = useAsync(api.getSlides);

    const onSelect = (slide) => {
      selectedSlides.value.push(slide)
    }

    const onRemove = (slide) => {
      selectedSlides.value = selectedSlides.value.filter(s => s !== slide)
    }

    const onSave = () => {
      emit('update:modelValue', selectedSlides.value)
      emit('close')
    }

    const onCancel = () => {
      emit('close')
    }

    onMounted(getSlides)

    return {
      allSlides,
      selectedSlides,
      loading,
      error: useErrorMessage(error),
      onSelect,
      onRemove,
      onSave,
      onCancel
    }
  },
})
</script>
