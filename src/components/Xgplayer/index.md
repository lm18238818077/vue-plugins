### 视频组件
 [西瓜播放器api](https://v2.h5player.bytedance.com/gettingStarted/#%E5%AE%89%E8%A3%85)

| 属性         | 类型    | 默认值  | 描述                         | 类型 |
| ----------- | ------- | ------ | --------------------------- | ---- |
| url     | string |  -  | 视频播放地址，现在url，flv结尾的触发flv播放器，其他的触发普通播放器                      | -    |
| ended     | function |  -  | 播放结束触发                      | -    |
| play     | function | - | 开始播放触发                    | -    |
| pause     | function |  -  | 播放暂停触发                    | -    |

### 例子
```
import Xgplayer from '@/components/Xgplayer/index.vue'
<Xgplayer

/>
```

