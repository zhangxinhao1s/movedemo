// Define TypeScript interfaces for the API response
interface Photo {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  liked: boolean;
  alt: string;
}

interface PexelsUser {
  id: number;
  name: string;
  url: string;
}

// 视频文件类型
interface PexelsVideoFile {
  id: number;
  quality: 'sd' | 'hd' | 'hls';
  file_type: string;
  width: number | null;
  height: number | null;
  link: string;
}

// 视频预览图类型
interface PexelsVideoPicture {
  id: number;
  picture: string;
  nr: number;
}

// 视频资源类型
interface PexelsVideo {
  id: number;
  width: number;
  height: number;
  url: string;
  image: string;
  duration: number;
  user: PexelsUser;
  video_files: PexelsVideoFile[];
  video_pictures: PexelsVideoPicture[];
}

interface PexelsResponse {
  photos: Photo[];
  videos: PexelsVideo[];
  page: number;
  per_page: number;
  total_results: number;
  next_page: string;
}

const API_KEY = '419vLlyUj1PDznijsidhHynxRcQruK4xGItNtKN0ddbiFXUoIXvr9KRt'; // Replace with your actual API key
const BASE_URL = 'https://api.pexels.com/videos';

export const searchVideos = async (
  query: string,
  perPage: number = 1,
  page: number = 1 // 新增 page 参数，默认值为 1
): Promise<PexelsResponse> => {
  try {
    const url = new URL(`${BASE_URL}/search`);
    url.searchParams.append('query', query);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('per_page', perPage.toString());

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: API_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json() as PexelsResponse;
  } catch (error) {
    console.error('Error fetching photos from Pexels:', error);
    throw error;
  }
};