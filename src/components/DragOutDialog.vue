<template>
  <el-dialog v-model="visible" v-bind="attrs" :fullscreen="fullscreen" :custom-class="`cjj${currentZIndex}`">
    <template #title>
      <div ref="headerRef">
        <slot name="title">{{title}}</slot>
      </div>
    </template>
    <template #header>
      <slot name="header" />
    </template>
    <slot />
    <template #footer>
      <slot name="footer" />
    </template>
  </el-dialog>
</template>
<script>

export default {
  inheritAttrs: false,
  name: "DragOutDialog",
};
</script>

<script setup>
import { computed, useAttrs, ref, onBeforeMount } from "vue";
import { ElDialog } from "element-plus";
import 'element-plus/es/components/dialog/style/css'

import useDraggable from "@/hooks/use-draggable/index.js";
import { useZIndex } from "../hooks/use-z-index";
const { currentZIndex, nextZIndex } = useZIndex()

const { draggable, fullscreen, title, ...attrs } = useAttrs();
const headerRef = ref();

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: () => true,
  }
})

const emits = defineEmits(["update:modelValue"]);

const visible = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emits("update:modelValue", value);
  },
})

const drag = computed(() => !fullscreen)
nextZIndex()
useDraggable(`.cjj${currentZIndex.value}`, headerRef, drag);

</script>


