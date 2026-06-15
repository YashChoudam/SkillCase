import { Router } from "express";

import {
  bookmarkVideoHandler,
  createCommentHandler,
  createVideoHandler,
  getCommentsHandler,
  getVideoByIdHandler,
  getVideosHandler,
  likeVideoHandler,
} from "../controller/video.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const videoRouter = Router();

videoRouter.route("/").post(authMiddleware, createVideoHandler).get(getVideosHandler);
videoRouter.route("/:id").get(getVideoByIdHandler);
videoRouter.route("/:id/like").post(authMiddleware, likeVideoHandler);
videoRouter.route("/:id/comment").post(authMiddleware, createCommentHandler);
videoRouter.route("/:id/comments").get(getCommentsHandler);
videoRouter.route("/:id/bookmark").post(authMiddleware, bookmarkVideoHandler);

export { videoRouter };
