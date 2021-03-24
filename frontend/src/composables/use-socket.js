import { io } from 'socket.io-client';
import { ref, onUnmounted } from 'vue'

const useSocket = (onDisplayUpdated) => {
  const connected = ref(false)
  const slideNumber = ref(null)
  const changingSlide = ref(false)
  const connectionError = ref(null)

  const socket = io();

  socket.on('connect', () => {
    console.log('Socket connected')
    connected.value = true
    connectionError.value = null
    socket.emit('querySlide', (slide) => {
      slideNumber.value = slide
    })
  });

  socket.on('connect_error', (e) => {
    connected.value = false
    console.error('Connection error')
    console.error(e)
    connectionError.value = e
  })

  socket.on('disconnect', () => {
    console.log('Socket disconnected')
    connected.value = false
    connectionError.value = new Error('Server disconnected')
  })

  socket.on('slideChange', (slide) => {
    changingSlide.value = false
    slideNumber.value = slide
  })

  onDisplayUpdated && socket.on('displayUpdate', onDisplayUpdated)

  const nextSlide = () => {
    changingSlide.value = true
    socket.emit('changeSlide', 'next')
  }

  const previousSlide = () => {
    changingSlide.value = true
    socket.emit('changeSlide', 'previous')
  }

  onUnmounted(() => {
    socket.close()
  })

  return {
    connected,
    connectionError,
    slideNumber,
    changingSlide,
    nextSlide,
    previousSlide
  }
}

export default useSocket;
