<template>
  <svg
    class="svg-icon"
    aria-hidden="true"
    :font-size="props.size"
    :title="props.title"
  >
    <use
      :xlink:href="iconName"
      :fill="color"
    />
  </svg>
</template>

<script setup>
import { computed } from 'vue'
defineOptions({
  name: 'IconSvg'
})
const props = defineProps({
  name: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  size: {
    type: Number,
    default: 20
  }
})
const iconName = computed(() => `#${props.name}`)
</script>

<style>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  overflow: hidden;
  fill: currentColor;
}
path {
  fill: unset;
}
</style>
