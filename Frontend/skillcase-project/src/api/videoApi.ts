import api from "./axiosConfig";

export interface Video {
  id: number;
  title: string;
  description: string;
  category: string;
  file_path: string;
  like_count: number;
  created_at: string;
}

export interface Comment {
  id: number;
  user_id: number;
  name: string;
  video_id: number;
  content: string;
  created_at: string;
}

export interface ApiResponseWrapper<T> {
  statusCode: number;
  data: T;
  message: string;
}

export interface LikeResponse {
  liked: boolean;
  alreadyLiked: boolean;
  like_count: number;
}

export interface BookmarkResponse {
  bookmarked: boolean;
  alreadyBookmarked: boolean;
}

export const videoApi = {
  createVideo: async (payload: { title: string; description: string; category: string; file_path: string }): Promise<ApiResponseWrapper<{ video: Video }>> => {
    const response = await api.post<ApiResponseWrapper<{ video: Video }>>("/videos", payload);
    return response.data;
  },

  getVideos: async (): Promise<ApiResponseWrapper<{ videos: Video[] }>> => {
    const response = await api.get<ApiResponseWrapper<{ videos: Video[] }>>("/videos");
    return response.data;
  },

  getVideoById: async (id: number): Promise<ApiResponseWrapper<{ video: Video }>> => {
    const response = await api.get<ApiResponseWrapper<{ video: Video }>>(`/videos/${id}`);
    return response.data;
  },

  likeVideo: async (id: number): Promise<ApiResponseWrapper<LikeResponse>> => {
    const response = await api.post<ApiResponseWrapper<LikeResponse>>(`/videos/${id}/like`);
    return response.data;
  },

  bookmarkVideo: async (id: number): Promise<ApiResponseWrapper<BookmarkResponse>> => {
    const response = await api.post<ApiResponseWrapper<BookmarkResponse>>(`/videos/${id}/bookmark`);
    return response.data;
  },

  getComments: async (id: number): Promise<ApiResponseWrapper<{ comments: Comment[] }>> => {
    const response = await api.get<ApiResponseWrapper<{ comments: Comment[] }>>(`/videos/${id}/comments`);
    return response.data;
  },

  createComment: async (id: number, content: string): Promise<ApiResponseWrapper<{ comment: Comment }>> => {
    const response = await api.post<ApiResponseWrapper<{ comment: Comment }>>(`/videos/${id}/comment`, { content });
    return response.data;
  },
};
