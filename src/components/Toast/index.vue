<template>
  <div v-if="show">
    <div class="key-wrapper">
      <p v-for="i in 10" :key="i" @click="handleClick(i-1)">
        {{ i - 1 }}
      </p>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    show: {
      type: Boolean
    }
  },
  emits: ['keypress'],
  setup(props, { emit }) {
    function handleClick(i) {
      emit('keypress', i)
    }

    return {
      handleClick
    }
  }
})
</script>

<style >
.key-wrapper p {
  background: pink;
}
</style>