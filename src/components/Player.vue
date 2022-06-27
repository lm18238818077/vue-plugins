<template>
  <div :id="`playerwrap${props.data.cid}`">
    <div
      class="wrap"
      @mouseenter="iconShow = true"
      @mouseleave="iconShow = false"
      ref="wrapRef"
    >
      <p>
        {{ eventToDesc.OnCallConnect.value.calltype[props.data.calltype] }} -
        {{ props.data.direction == 'in' ? props.data.caller : props.data.callee}}
      </p>
      <div class="playicon">
        <el-icon
          :size="50"
          color="#ddd"
          v-show="iconShow"
          @click="playChange(played)"
        >
          <video-pause v-if="played" />
          <video-play v-else />
        </el-icon>
      </div>
      <el-tooltip content="挂断" placement="top" effect="light">
        <el-icon
          v-show="iconShow"
          @click="handleClose(props.data)"
          :size="25"
          color="#fff"
          class="reject"
        >
          <circle-close />
        </el-icon>
      </el-tooltip>
      <el-icon
        class="share"
        :size="25"
        color="#fff"
        @click="handleShare(props.data)"
        v-if="(props.data.calltype == 'dispatch' || props.data.calltype == 'monitor') && iconShow"
        ><Share
      /></el-icon>
      <svg
        t="1652772986909"
        class="icon iconall"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="8983"
        width="25"
        height="25"
        v-show="iconShow && !dialogVisible"
        @click="handleAll"
      >
        <path
          d="M285.866667 810.666667H384v42.666666H213.333333v-170.666666h42.666667v98.133333l128-128 29.866667 29.866667-128 128z m494.933333 0l-128-128 29.866667-29.866667 128 128V682.666667h42.666666v170.666666h-170.666666v-42.666666h98.133333zM285.866667 256l128 128-29.866667 29.866667-128-128V384H213.333333V213.333333h170.666667v42.666667H285.866667z m494.933333 0H682.666667V213.333333h170.666666v170.666667h-42.666666V285.866667l-128 128-29.866667-29.866667 128-128z"
          fill="#ffffff"
          p-id="8984"
        ></path>
      </svg>
      <svg
        t="1652772896356"
        class="icon iconall"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="8793"
        width="25"
        height="25"
        v-show="iconShow && dialogVisible"
        @click="handleDiaClose"
      >
        <path
          d="M354.133333 682.666667H256v-42.666667h170.666667v170.666667H384v-98.133334L243.2 853.333333l-29.866667-29.866666L354.133333 682.666667z m358.4 0l140.8 140.8-29.866666 29.866666-140.8-140.8V810.666667h-42.666667v-170.666667h170.666667v42.666667h-98.133334zM354.133333 384L213.333333 243.2l29.866667-29.866667L384 354.133333V256h42.666667v170.666667H256V384h98.133333z m358.4 0H810.666667v42.666667h-170.666667V256h42.666667v98.133333L823.466667 213.333333l29.866666 29.866667L712.533333 384z"
          fill="#ffffff"
          p-id="8794"
        ></path>
      </svg>
      <div
        ref="playerRef"
        class="inner"
        :style="{
          width: `${dialogVisible ? props.width * 2 : props.width}px`,
          height: `${dialogVisible ? props.height * 2 : props.height}px`,
        }"
      ></div>
    </div>
  </div>
  <el-dialog
    v-model="dialogVisible"
    :width="740"
    @close="handleDiaClose"
    :append-to-body="true"
    :destroy-on-close="true"
    :show-close="false"
  >
    <div id="dialoginner"></div>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { ElDialog, ElTooltip, ElIcon } from "element-plus";
import 'element-plus/es/components/dialog/style/css'
import 'element-plus/es/components/tooltip/style/css'
import 'element-plus/es/components/icon/style/css'

import { monitorParam } from "@/config";
import eventToDesc from "@/config/OnDialInRinging";

const playerRef = ref(null);
const playerMsp = ref(null);
const played = ref(true);
const iconShow = ref(false);
const dialogVisible = ref(false);
const wrapRef = ref(null);

const props = defineProps({
  width: {
    type: Number,
    default: () => monitorParam.width,
  },
  height: {
    type: Number,
    default: () => monitorParam.height,
  },
  data: {
    type: Object,
    default: () => ({}),
  },
});

const emits = defineEmits(["play", "pause", "stop", "share"]);

onMounted(() => {
  const playerConfig = {
    wsUrl: props.data.wssUrl,
    el: playerRef.value,
    sharpType: {
      width: props.width,
      height: props.height,
    },
    cid: props.data["cid"],
  };
  playerMsp.value = new MSP_PLAYER(playerConfig);
});

const handleAll = async () => {
  dialogVisible.value = true;
  await nextTick();
  document.getElementById("dialoginner").appendChild(wrapRef.value);
};

const playChange = (value) => {
  played.value = !value;
  if (value) {
    emits("pause");
    playerMsp.value?.pause();
  } else {
    emits("play");
    playerMsp.value?.play();
  }
};

const handleClose = (id) => {
  emits("stop", id);
};
const handleDiaClose = () => {
  dialogVisible.value = false;
  document
    .getElementById(`playerwrap${props.data.cid}`)
    .appendChild(wrapRef.value);
}

const handleShare = (data) => {
  emits('share', { ...data, ...data.calltype == 'monitor' && { src: data.callee } })
}
</script>
<script>
export default {
  name: "Player",
};
</script>
<style scoped>
.wrap {
  position: relative;
  background: #fff;
  margin-bottom: 4px;
}

.wrap > p {
  text-align: center;
  margin-bottom: 4px;
}

.wrap .inner {
  background: rgba(0, 0, 0, 0.1);
}

.wrap > .playicon {
  width: 50px;
  height: 50px;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  cursor: pointer;
  z-index: 1;
}

.wrap > .iconall {
  position: absolute;
  right: 10px;
  bottom: 10px;
  z-index: 1;
  cursor: pointer;
}

.wrap > .reject {
  position: absolute;
  right: 10px;
  top: 32px;
  z-index: 1;
  cursor: pointer;
}
.wrap > .share {
  position: absolute;
  left: 10px;
  bottom: 10px;
  z-index: 1;
  cursor: pointer;
}
.wrap :deep(#msp-player-box) {
  cursor: inherit !important;
}
</style>
