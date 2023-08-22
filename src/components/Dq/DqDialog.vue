<template>
  <Teleport
    :disabled="isNoTeleport"
    to="#app"
  >
    <div
      class="dqapp"
      :class="{ small: props.small }"
    >
      <el-dialog
        :width="props.width"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        :modal="props.small ? false : true"
        :draggable="true"
        :destroy-on-close="true"
        :class="`dq_dialog_${th}`"
        v-bind="$attrs"
      >
        <slot />
      </el-dialog>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import { ElDialog } from "element-plus";
import 'element-plus/es/components/dialog/style/css'

defineOptions({
  inheritAttrs: false
})
const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
  dqData: {
    type: Object,
    default: () => ({})
  },
  width: {
    type: Number,
    default: () => 300
  },
  isNoTeleport: {
    type: Boolean,
    default: () => true
  },
  small: {
    type: Boolean,
    default: () => false
  }
})


const th = ref(document.querySelectorAll('[class*="dq_dialog_"]')?.length + 1)

const emits = defineEmits(['close'])

</script>

<style scoped lang="less">
.dq(@n, @i: 1) when (@i =< @n) {
  @cur: mod((@i - 1), 3);
  @index: floor(((@i - 1) / 3));
  .el-dialog.dq_dialog_@{i} {
    position: absolute;
    top: 300px * @cur;
    right: 360px * @index;
  }
  .dq(@n, (@i + 1));
}

.dqapp {
  :deep(.el-dialog){
      background: linear-gradient(180deg, rgba(35, 122, 200, 0.46) 0%, rgba(9, 45, 66, 0.46) 100%), linear-gradient(rgba(23, 97, 160, 0.8), rgba(23, 97, 160, 0.8));
      border: solid 1px rgba(35, 122, 200, 0.8);
      border-top: 2px solid #70d8ff;
    }
  &.small {
    & > :deep(div[style~='z-index:']) {
      visibility: hidden;
      & > div[role='dialog']{
        & > .el-dialog {
          visibility: visible;
          margin: 0;
        }
        .dq(16)
      }
    }
    :deep(.el-dialog__header){
      margin-right: 0;
      padding-top: 14px;
    }

    :deep(.el-dialog__header){
      padding: 10px 8px 7px;
      & i.close:hover{
        color: #fff
      }
    }
    :deep(.el-dialog__body){
      padding: 0 8px 20px;
      min-height: 230px;
    }
  }

  .my-header{
    display: flex;
    align-items: center;
    .el-dialog__title{
      color: #fff;
      font-size: 16px;
    }
    & > i{
      margin-left: auto;
    }
    .people{
      margin-left: 10px;
      color: #0dff51;
      display: flex;
      justify-content: center;
      align-items: center;
      & > img{
        height: 20px;
        margin-right: 4px;
      }
    }
  }
  i.el-icon{
    cursor: pointer;
  }
}
</style>
