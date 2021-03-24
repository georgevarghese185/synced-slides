<template>
  <q-list>
    <q-item
      clickable
      v-ripple
      v-for="slide in slides"
      :key="slide.id"
      @click="onClick(slide, $event)"
    >
      <q-item-section thumbnail>
        <img :src="slide.url" class="thumbnail">
      </q-item-section>
      <q-item-section class="text-h6">{{ slide.name }}</q-item-section>
      <div class="column justify-center" v-if="deletable">
        <q-btn
          flat
          color="red"
          icon="delete"
          :loading="deleting === slide.id"
          @click="onDelete(slide, $event)"
        />
      </div>
    </q-item>
  </q-list>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  props: ['slides', 'deletable', 'deletingId'],
  setup(props, { emit }) {
    const onClick = (slide, e) => {
      e.stopPropagation()
      emit('click', slide)
    }

    const onDelete = (slide, e) => {
      e.stopPropagation()
      emit('delete', slide)
    }

    return {
      onClick,
      onDelete
    }
  },
})
</script>

<style scoped>
  .thumbnail {
    width: auto;
    height: 200px;
  }
</style>
