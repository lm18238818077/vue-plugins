<template>
  <el-button @click="handleClose">{{ props.msg }}</el-button>
  <el-dialog v-model="dialogVisible" title="Tips" width="30%" :before-close="handleClose">
    <span>This is a message</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogVisible = false">Confirm</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ElButton, ElMessageBox, ElDialog } from 'element-plus'
import 'element-plus/dist/index.css'
import { ref, getCurrentInstance } from 'vue'

let { proxy } = getCurrentInstance();

const props = defineProps({
  msg: {
    type: String,
    default: () => '',
  }
});


const dialogVisible = ref(false)

const handleClose = (done) => {
  proxy.$myToast({
    message: '我是toast插件',
    duration: 3000,
    onClose: () => {
      console.log('已关闭');
    },
  });
}

</script>

<style scoped>
</style>
