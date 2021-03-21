<template>
  <q-page class="flex row q-pa-md position-relative">
    <circular-progress v-if="loading" />

    <p v-if="error" class="text-body1 text-red">{{error}}</p>

    <p
      v-if="displays && displays.length === 0"
      class="text-subtitle1 text-grey-6 full-width text-center"
    >
      No Displays
    </p>

    <q-list v-if="displays" class="full-width">
      <q-item
        clickable
        v-ripple
        v-for="display in displays"
        :key="display.id"
        @click="onClick(display)"
      >
        <q-item-section>
          <p class="text-h6">{{ display.name }}</p>
          <p class="text-body">Login Name: {{ display.loginName }}</p>
        </q-item-section>
        <div class="column justify-center">
          <q-btn
            flat
            color="red"
            icon="delete"
            :loading="deleteLoading && deletingDisplay === display.id"
            @click="onDelete(display, $event)"
          />
        </div>
      </q-item>
    </q-list>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" to='/admin/displays/new' />
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

export default defineComponent({
  components: {
    CircularProgress,
  },
  setup() {
    const router = useRouter()
    const {
      data: displays,
      loading,
      error,
      doAsync: getDisplays
    } = useAsync(api.getDisplays);
    const {
      data: deleteResponse,
      loading: deleteLoading,
      doAsync: deleteDisplay
    } = useAsync(api.deleteDisplay);
    const deletingDisplay = ref(null)

    const onClick = (display) => {
      router.push(`/admin/displays/${display.id}`)
    }

    const onDelete = (display, e) => {
      e.stopPropagation()
      deletingDisplay.value = display.id
      deleteDisplay(display.id)
    }

    onMounted(getDisplays)
    watch(deleteResponse, getDisplays)

    return {
      displays,
      loading,
      deleteLoading,
      deletingDisplay,
      error: useErrorMessage(error),
      onClick,
      onDelete
    }
  },
})
</script>
