import { computed } from 'vue'

const useErrorMessage = (error) => {
  return computed(() => {
    return error.value
      && ((error.value.response || {}).data || {}).message || (error.value || {}).message
  })
}

export default useErrorMessage;
