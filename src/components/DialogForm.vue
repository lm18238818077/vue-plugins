<template>
  <el-dialog
    v-model="visible"
    title="视频分发"
    :append-to-body="true"
  >
    <el-form :model="numberValidateForm" :rules="rules" ref="formRef" label-width="130px">
      <el-form-item label="分发用户列表" prop="dest">
        <el-select
          v-model="numberValidateForm.dest"
          filterable
          placeholder="请选择"
          multiple
          :style="{width: '330px'}"
        >
          <el-option
            v-for="v in user"
            :key="v"
            :label="v"
            :value="v"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="群组分发列表" prop="destGroups">
        <el-select
          v-model="numberValidateForm.destGroups"
          filterable
          placeholder="请选择"
          multiple
          :style="{width: '330px'}"
        >
          <el-option
            v-for="v in dynamicGroup"
            :key="v.group"
            :label="v.name"
            :value="v.group"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="handleShare">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'DialogForm'
}
</script>
<script setup>
import { computed, reactive, ref, onMounted } from 'vue'
import { ElMessage, ElDialog, ElButton, ElForm, ElFormItem, ElSelect, ElOption } from "element-plus";
import 'element-plus/es/components/dialog/style/css'
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/button/style/css'
import 'element-plus/es/components/form/style/css'
import 'element-plus/es/components/form-item/style/css'
import 'element-plus/es/components/select/style/css'
import 'element-plus/es/components/option/style/css'

import { storeToRefs } from "pinia";
import { sameStatus } from "@/config/status";
import { user } from "@/config";
import { useIcpStore } from "@/store/icp";

const icpStore = useIcpStore();
const { dynamicGroup } = storeToRefs(icpStore);
const username = localStorage.getItem("ms_username");

const numberValidateForm = reactive({
  dest: [],
  destGroups: [],
});

const rules = reactive({
  dest: [
    { required: true, message: '请选择', trigger: 'change' },
  ]
})

const formRef = ref(null)
const emits = defineEmits(['update:visible'])

const props = defineProps({
  cloudICP: {
    type: Object,
    default: () => ({}),
  },
  data: {
    type: Object,
    default: () => ({}),
  },
  visible: {
    type: Boolean,
    default: () => false,
  },
});

const visible = computed({
  get () {
    return props.visible
  },
  set (value) {
    emits('update:visible', value)
  }
})

onMounted(() => {
  if(!dynamicGroup.value?.length){
    props.cloudICP?.dispatch.query.queryDynamicGroup({
      callback: ({ rsp, desc, list }) => {
        if (rsp == 0) {
          let res = list.filter(v=>v.setupdcid == username)
          icpStore.setDynamicGroup(res || [])
        }
      },
    })
  }
})


//设置为NO表示分发的格式根据源格式而定分发到用户时，你也可以设置为CIF，以CIF格式进行分发。目前视频分发只支持这两个分辨率设置。另外，如果你需要分发到群组，请设置为CIF。
const handleShare = async () => {
  if (!formRef.value) return
  await formRef.value.validate((valid, fields) => {
    if (valid) {
      props.cloudICP.dispatch.video.dispatchVideo({
        src: props.data.src,
        fmt: 'CIF',
        dest: numberValidateForm.dest.map((v) => ({ isdn: v })),
        destGroups: numberValidateForm.destGroups.map((v) => ({ isdn: v })),
        callback: ({ rsp, desc }) => {
          if (rsp == 0) {
            ElMessage.success("分发成功");
            formRef.value.resetFields()
          } else {
            ElMessage.error(`错误码:${rsp},${sameStatus[rsp] || desc}`);
          }
          visible.value = false
        },
      })
    } else {
      console.log('error submit!', fields)
    }
  })
  
};
</script>

