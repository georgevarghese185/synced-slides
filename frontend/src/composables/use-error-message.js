import { computed } from 'vue'

const useErrorMessage = (error) => {
  return computed(() => {
    return error.value
      && ((error.value.response || {}).data || {}).message || error.message
  })
}

export default useErrorMessage;
