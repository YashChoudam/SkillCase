import { ApiResponse } from "../utils/api.response.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  createVideoSchema,
  createCommentSchema,
  videoIdSchema,
} from "../validators/video.validator.js";
import {
  bookmarkVideo,
  createComment,
  createVideo,
  getCommentsByVideoId,
  getVideoById,
  getVideos,
  likeVideo,
} from "../services/video.service.js";

const getAuthUserId = (user: Express.Request["user"]) => {
  return user?.id as number;
};

const createVideoHandler = asyncHandler(async (req, res) => {
  const payload = createVideoSchema.parse(req.body);
  const video = await createVideo(payload);

  return res
    .status(201)
    .json(new ApiResponse(201, { video }, "Video created successfully"));
});

const getVideosHandler = asyncHandler(async (_req, res) => {
  const videos = await getVideos();

  return res
    .status(200)
    .json(new ApiResponse(200, { videos }, "Videos fetched successfully"));
});

const getVideoByIdHandler = asyncHandler(async (req, res) => {
  const { id } = videoIdSchema.parse(req.params);
  const video = await getVideoById(id);

  return res
    .status(200)
    .json(new ApiResponse(200, { video }, "Video fetched successfully"));
});

const likeVideoHandler = asyncHandler(async (req, res) => {
  const { id } = videoIdSchema.parse(req.params);
  const result = await likeVideo(getAuthUserId(req.user), id);

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Video liked successfully"));
});

const createCommentHandler = asyncHandler(async (req, res) => {
  const { id } = videoIdSchema.parse(req.params);
  const { content } = createCommentSchema.parse(req.body);
  const comment = await createComment(getAuthUserId(req.user), id, content);

  return res
    .status(201)
    .json(new ApiResponse(201, { comment }, "Comment added successfully"));
});

const getCommentsHandler = asyncHandler(async (req, res) => {
  const { id } = videoIdSchema.parse(req.params);
  const comments = await getCommentsByVideoId(id);

  return res
    .status(200)
    .json(new ApiResponse(200, { comments }, "Comments fetched successfully"));
});

const bookmarkVideoHandler = asyncHandler(async (req, res) => {
  const { id } = videoIdSchema.parse(req.params);
  const result = await bookmarkVideo(getAuthUserId(req.user), id);

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Video bookmarked successfully"));
});

export {
  createVideoHandler,
  getVideosHandler,
  getVideoByIdHandler,
  likeVideoHandler,
  createCommentHandler,
  getCommentsHandler,
  bookmarkVideoHandler,
};
