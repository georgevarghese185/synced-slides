<template>
  <q-page class="flex row q-pa-md">
    <q-form
      @submit="onSubmit"
      class="q-gutter-md col-5"
      :greedy="true"
      v-if="!displayLoading"
    >
      <p class="text-h4 q-mb-md">{{display ? 'Edit' : 'New'}} Display</p>

      <q-input
        outlined
        v-model="name"
        label="Display Name"
        :rules="[name => !!name]"
      />

      <q-input
        outlined
        v-model="loginName"
        label="Login Name"
        :rules="[loginName => !!loginName]"
      />

      <p v-if="createError" class="text-body1 text-red">{{createError}}</p>

      <div>
        <q-btn label="Save" type="submit" :loading="createLoading" color="primary"/>
        <q-btn
          flat
          label="Cancel"
          color="primary"
          to="/admin/displays"
          class="q-ml-sm"
          :disable="createLoading"
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

export default defineComponent({
  setup() {
    const name = ref(null);
    const loginName = ref(null);
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

    const onSubmit = async () => {
      createDisplay({
        name: name.value,
        loginName: loginName.value,
        slides: []
      })
    }

    watch(createResponse, () => {
      router.push('/admin/displays')
    })

    watch(display, () => {
      if (display.value) {
        name.value = display.value.name
        loginName.value = display.value.loginName
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
      onSubmit,
      display,
      displayLoading,
      displayError: useErrorMessage(displayError),
      createLoading,
      createError: useErrorMessage(createError),
    }
  },
})
</script>
