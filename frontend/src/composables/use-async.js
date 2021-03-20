import { ref } from 'vue';

const useAsync = (asyncFn) => {
  const data = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const doAsync = async (...args) => {
    loading.value = true;
    error.value = null;
    try {
      const result = await asyncFn(...args);
      data.value = result;
    } catch (e) {
      error.value = e;
    }
    loading.value = false;
  }

  return {
    data,
    loading,
    error,
    doAsync,
  }
}

export default useAsync;
