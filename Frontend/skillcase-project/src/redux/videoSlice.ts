import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { videoApi } from "../api/videoApi";
import type { Video, Comment } from "../api/videoApi";

export interface VideoState {
  videos: Video[];
  comments: { [videoId: number]: Comment[] };
  likedVideoIds: { [videoId: number]: boolean };
  bookmarkedVideoIds: { [videoId: number]: boolean };
  activeCategory: string;
  loading: boolean;
  commentsLoading: boolean;
  error: string | null;
}

const initialState: VideoState = {
  videos: [],
  comments: {},
  likedVideoIds: JSON.parse(localStorage.getItem("likedVideoIds") || "{}"),
  bookmarkedVideoIds: JSON.parse(localStorage.getItem("bookmarkedVideoIds") || "{}"),
  activeCategory: "All",
  loading: false,
  commentsLoading: false,
  error: null,
};

const getErrorMessage = (err: any) => {
  return err.response?.data?.message || err.message || "An unexpected error occurred";
};

// Async Thunks
export const fetchVideos = createAsyncThunk(
  "video/fetchVideos",
  async (_, { rejectWithValue }) => {
    try {
      const response = await videoApi.getVideos();
      return response.data.videos;
    } catch (err: any) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const createVideo = createAsyncThunk(
  "video/createVideo",
  async (payload: { title: string; description: string; category: string; file_path: string }, { rejectWithValue }) => {
    try {
      const response = await videoApi.createVideo(payload);
      return response.data.video;
    } catch (err: any) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const fetchComments = createAsyncThunk(
  "video/fetchComments",
  async (videoId: number, { rejectWithValue }) => {
    try {
      const response = await videoApi.getComments(videoId);
      return { videoId, comments: response.data.comments };
    } catch (err: any) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const addComment = createAsyncThunk(
  "video/addComment",
  async ({ videoId, content }: { videoId: number; content: string }, { rejectWithValue }) => {
    try {
      const response = await videoApi.createComment(videoId, content);
      return { videoId, comment: response.data.comment };
    } catch (err: any) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

// Toggle/Execute Like (handles optimistic state internally)
export const likeVideoAction = createAsyncThunk(
  "video/likeVideo",
  async (videoId: number, { rejectWithValue }) => {
    try {
      // Background call to the server
      const response = await videoApi.likeVideo(videoId);
      return { videoId, like_count: response.data.like_count };
    } catch (err: any) {
      // Rollback is automatically done by handling rejection
      return rejectWithValue({ videoId, error: getErrorMessage(err) });
    }
  }
);

// Toggle/Execute Bookmark (optimistic)
export const bookmarkVideoAction = createAsyncThunk(
  "video/bookmarkVideo",
  async (videoId: number, { rejectWithValue }) => {
    try {
      await videoApi.bookmarkVideo(videoId);
      return { videoId };
    } catch (err: any) {
      return rejectWithValue({ videoId, error: getErrorMessage(err) });
    }
  }
);

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    setActiveCategory: (state, action: PayloadAction<string>) => {
      state.activeCategory = action.payload;
    },
    // Optimistic UI updates
    optimisticLike: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      if (!state.likedVideoIds[id]) {
        state.likedVideoIds[id] = true;
        localStorage.setItem("likedVideoIds", JSON.stringify(state.likedVideoIds));
        
        // Find video and increment
        const video = state.videos.find((v) => v.id === id);
        if (video) {
          video.like_count += 1;
        }
      }
    },
    optimisticBookmark: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      if (state.bookmarkedVideoIds[id]) {
        delete state.bookmarkedVideoIds[id];
      } else {
        state.bookmarkedVideoIds[id] = true;
      }
      localStorage.setItem("bookmarkedVideoIds", JSON.stringify(state.bookmarkedVideoIds));
    },
  },
  extraReducers: (builder) => {
    // Fetch Videos
    builder.addCase(fetchVideos.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchVideos.fulfilled, (state, action) => {
      state.loading = false;
      state.videos = action.payload;
    });
    builder.addCase(fetchVideos.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create Video
    builder.addCase(createVideo.fulfilled, (state, action) => {
      state.videos.unshift(action.payload); // prepend to top
    });

    // Fetch Comments
    builder.addCase(fetchComments.pending, (state) => {
      state.commentsLoading = true;
    });
    builder.addCase(fetchComments.fulfilled, (state, action) => {
      state.commentsLoading = false;
      state.comments[action.payload.videoId] = action.payload.comments;
    });
    builder.addCase(fetchComments.rejected, (state) => {
      state.commentsLoading = false;
    });

    // Add Comment
    builder.addCase(addComment.fulfilled, (state, action) => {
      const { videoId, comment } = action.payload;
      if (!state.comments[videoId]) {
        state.comments[videoId] = [];
      }
      state.comments[videoId].unshift(comment); // newest comment on top
    });

    // Like Action (success confirmation)
    builder.addCase(likeVideoAction.fulfilled, (state, action) => {
      const { videoId, like_count } = action.payload;
      const video = state.videos.find((v) => v.id === videoId);
      if (video) {
        video.like_count = like_count;
      }
    });
    // Like Action (failure rollback)
    builder.addCase(likeVideoAction.rejected, (state, action: any) => {
      const videoId = action.payload?.videoId;
      if (videoId && state.likedVideoIds[videoId]) {
        // Rollback liked status
        delete state.likedVideoIds[videoId];
        localStorage.setItem("likedVideoIds", JSON.stringify(state.likedVideoIds));
        
        const video = state.videos.find((v) => v.id === videoId);
        if (video) {
          video.like_count = Math.max(0, video.like_count - 1);
        }
      }
    });

    // Bookmark Action (failure rollback)
    builder.addCase(bookmarkVideoAction.rejected, (state, action: any) => {
      const videoId = action.payload?.videoId;
      if (videoId && state.bookmarkedVideoIds[videoId]) {
        delete state.bookmarkedVideoIds[videoId];
        localStorage.setItem("bookmarkedVideoIds", JSON.stringify(state.bookmarkedVideoIds));
      }
    });
  },
});

export const { setActiveCategory, optimisticLike, optimisticBookmark } = videoSlice.actions;
export default videoSlice.reducer;
