<template>
  <div class="waterfall-container">
    <div class="waterfall-column" v-for="(col, i) in columns" :key="i">
      <div class="waterfall-item" v-for="item in col" :key="item.id">
        <!-- 图片显示 -->
        <img 
          v-if="!item.type"
          :src="item.img" 
          :style="{ height: `${item.height/10}px` }" 
          @click="handleImageClick(item)"
        />
        
        <!-- 视频显示 -->
        <div v-else class="video-container" @click="handleVideoClick(item, $event)">
          <video
            ref="videoPlayer"
            :data-id="item.id"
            :poster="item.img"
            :style="{ height: `${item.height/10}px` }"
          >
            <source :src="item.videoUrl" type="video/mp4">
          </video>
          <div v-if="!item.playing" class="video-play-button">
            <img src="../assets/pause.svg" alt="播放">
          </div>
          <div class="video-duration" v-if="item.duration">
            {{ formatDuration(item.duration) }}
          </div>
        </div>
        
        <!-- 媒体信息 -->
        <div class="media-info">
          <p class="item-title">版本前瞻版本前瞻版本前瞻版本前瞻版本前瞻</p>
          <p class="item-describe">恐龙岛</p>
          <div class="item-names">
            <div>{{ item.title }}</div>
            <div class="thumbs">
              <img class="icon" src="../assets/thumbsUp.svg" alt="">
              <span>{{ item.type ? '视频' : '图片' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType, computed, ref } from 'vue'

interface ListItem {
  id: number
  img: string
  title: string
  height: number
  width: number
  type: boolean // false=图片, true=视频
  videoUrl?: string
  duration?: number
  playing?: boolean
}

export default defineComponent({
  name: 'Waterfall',
  props: {
    list: {
      type: Array as PropType<ListItem[]>,
      required: true
    },
    columnCount: {
      type: Number,
      default: 2
    }
  },
  setup(props) {
    const videoPlayers = ref<HTMLVideoElement[]>([])
    let currentlyPlayingVideo: HTMLVideoElement | null = null

    // 将列表项分配到各列
    const columns = computed(() => {
      const cols: ListItem[][] = Array(props.columnCount)
        .fill(null)
        .map(() => [])
      
      props.list.forEach((item, index) => {
        cols[index % props.columnCount].push(item)
      })
      
      return cols
    })

    // 格式化视频时长
    const formatDuration = (seconds: number): string => {
      const mins = Math.floor(seconds / 60)
      const secs = Math.floor(seconds % 60)
      return `${mins}:${secs < 10 ? '0' : ''}${secs}`
    }

    // 处理图片点击
    const handleImageClick = (item: ListItem) => {
      console.log('打开图片:', item.img)
      // 这里可以添加图片预览逻辑
    }

    // 处理视频点击
    const handleVideoClick = (item: ListItem, event: MouseEvent) => {
      //@ts-ignore
      const videoElement = event.currentTarget?.querySelector('video') as HTMLVideoElement
      
      // 暂停当前正在播放的视频
      if (currentlyPlayingVideo && currentlyPlayingVideo !== videoElement) {
        currentlyPlayingVideo.pause()
        const playingItem = props.list.find(i => i.id === parseInt(currentlyPlayingVideo?.dataset?.id || ''))
        if (playingItem) playingItem.playing = false
      }
      
      // 切换当前视频的播放状态
      if (videoElement.paused) {
        videoElement.play()
        item.playing = true
        currentlyPlayingVideo = videoElement
        
        // 视频结束后重置状态
        videoElement.onended = () => {
          item.playing = false
        }
      } else {
        videoElement.pause()
        item.playing = false
        currentlyPlayingVideo = null
      }
    }

    return {
      columns,
      videoPlayers,
      formatDuration,
      handleImageClick,
      handleVideoClick
    }
  }
})
</script>

<style scoped>
.waterfall-container {
  display: flex;
  padding: 10px;
  gap: 10px;
}

.waterfall-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.waterfall-item {
  position: relative;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.waterfall-item img, 
.waterfall-item video {
  width: 100%;
  object-fit: cover;
  cursor: pointer;
  display: block;
}

.video-container {
  position: relative;
  cursor: pointer;
}

.video-play-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-play-button img {
  width: 20px;
  height: 20px;
}

.video-duration {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

.media-info {
  padding: 8px;
}

.item-title {
  font-weight: 600;
  text-align: left;
  margin: 0;
  font-size: 14px;
}

.item-describe {
  text-align: left;
  color: #ccc;
  font-size: 12px;
  margin: 4px 0;
}

.item-names {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #b0b0b0;
}

.thumbs {
  display: flex;
  align-items: center;
  gap: 4px;
}

.icon {
  height: 15px;
  width: 15px;
}
</style>