<template>
  <van-pull-refresh v-model="state.refreshing" @refresh="onRefresh">
    <van-list
      v-model:loading="state.loading"
      :finished="state.finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <Waterfall :list="state.list" :column-count="2" />
    </van-list>
  </van-pull-refresh>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted} from 'vue'
import { useRoute } from 'vue-router'
import Waterfall from '../components/waterfall.vue'
import { searchPhotos } from '../utils/pexels.ts';
import { searchVideos } from '../utils/pexelsVideo.ts';

interface MediaItem {
  id: number
  img: string
  title: string
  height: number
  width: number
  type: boolean // false=图片, true=视频
  videoUrl?: string
  duration?: number
}

interface State {
  list: MediaItem[]
  loading: boolean
  query:string,
  finished: boolean
  refreshing: boolean
  page: number
  perPage: number
}

export default defineComponent({
  name: 'PullRefreshWithWaterfall',
  components: {
    Waterfall,
  },
  setup() {
    const route = useRoute()
    const state = reactive<State>({
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      page: 1,
      query: 'nature',
      perPage: 10 // 每页加载10个媒体项
    })

    // 转换图片数据
    const convertPhotosToItems = (photos: any[]): MediaItem[] => {
      return photos.map(photo => ({
        id: photo.id,
        img: photo.src?.medium || photo.src?.original || '',
        title: photo.photographer || 'Unknown',
        height: photo.height || 300, // 默认高度
        width: photo.width || 400,  // 默认宽度
        type: false // 图片类型
      }))
    }

    // 转换视频数据
    const convertVideosToItems = (videos: any[]): MediaItem[] => {
      return videos.map(video => ({
        id: video.id,
        img: video.image || video.video_pictures?.[0]?.picture || '',
        title: video.user?.name || 'Unknown',
        height: video.height || 300, // 默认高度
        width: video.width || 400,  // 默认宽度
        type: true, // 视频类型
        videoUrl: video.video_files?.[0]?.link || '',
        duration: video.duration
      }))
    }

    // 加载混合媒体数据
    const loadMixedMediaData = async (isRefresh = false) => {
      try {
        state.loading = true
        
        // 并行请求图片和视频
        const [photosResponse, videosResponse] = await Promise.all([
          searchPhotos(state.query, Math.ceil(state.perPage/2), state.page),
          searchVideos(state.query, Math.floor(state.perPage/2), state.page)
        ])

        const photoItems = convertPhotosToItems(photosResponse.photos || [])
        const videoItems = convertVideosToItems(videosResponse.videos || [])
        
        // 合并并随机排序
        const mergedItems = [...photoItems, ...videoItems]
          .sort(() => Math.random() - 0.5)

        if (isRefresh) {
          state.list = mergedItems
        } else {
          state.list = [...state.list, ...mergedItems]
        }
        
        // 检查是否已加载完所有数据
        const allLoaded = 
          (photosResponse.photos?.length || 0) < Math.ceil(state.perPage/2) &&
          (videosResponse.videos?.length || 0) < Math.floor(state.perPage/2)
        state.finished = allLoaded
        
      } catch (error) {
        console.error('加载媒体数据失败:', error)
      } finally {
        state.loading = false
        state.refreshing = false
      }
    }

    // 下拉刷新
    const onRefresh = async () => {
      state.refreshing = true
      state.page = 1
      state.finished = false
      
      await loadMixedMediaData(true)
    }

    // 上拉加载
    const onLoad = async () => {
      if (state.finished) return
      state.page++
      await loadMixedMediaData()
    }
   
   
    // 初始化加载
    onMounted(() => {
       console.log(route.query.page)
       if(route.query.page){
        state.page = route.query.page as any
      }
      if(route.query.query){
        state.query = route.query.query as string
      }
      loadMixedMediaData()
    })

    return {
      state,
      onRefresh,
      onLoad,
      
    }
  }
})
</script>