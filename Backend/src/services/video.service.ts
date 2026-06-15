import { pool } from "../config/database.config.js";
import { ApiError } from "../utils/api.errors.js";

type CreateVideoInput = {
  title: string;
  description: string;
  category: string;
  file_path: string;
};

const createVideo = async (input: CreateVideoInput) => {
  const result = await pool.query(
    `INSERT INTO videos (title, description, category, file_path)
     VALUES ($1, $2, $3, $4)
     RETURNING id, title, description, category, file_path, like_count, created_at`,
    [input.title, input.description, input.category, input.file_path]
  );

  return result.rows[0];
};

const getVideos = async () => {
  const result = await pool.query(
    `SELECT id, title, description, category, file_path, like_count, created_at
     FROM videos
     ORDER BY created_at DESC`
  );

  return result.rows;
};

const getVideoById = async (videoId: number) => {
  const result = await pool.query(
    `SELECT id, title, description, category, file_path, like_count, created_at
     FROM videos
     WHERE id = $1`,
    [videoId]
  );

  const video = result.rows[0];

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  return video;
};

const likeVideo = async (userId: number, videoId: number) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const video = await client.query("SELECT id FROM videos WHERE id = $1", [
      videoId,
    ]);

    if (video.rows.length === 0) {
      throw new ApiError(404, "Video not found");
    }

    const like = await client.query(
      `INSERT INTO likes (user_id, video_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, video_id) DO NOTHING
       RETURNING user_id, video_id`,
      [userId, videoId]
    );

    let likeCountResult;

    if (like.rows.length > 0) {
      likeCountResult = await client.query(
        `UPDATE videos
         SET like_count = like_count + 1
         WHERE id = $1
         RETURNING like_count`,
        [videoId]
      );
    } else {
      likeCountResult = await client.query(
        "SELECT like_count FROM videos WHERE id = $1",
        [videoId]
      );
    }

    await client.query("COMMIT");

    return {
      liked: true,
      alreadyLiked: like.rows.length === 0,
      like_count: likeCountResult.rows[0].like_count,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const createComment = async (
  userId: number,
  videoId: number,
  content: string
) => {
  const video = await pool.query("SELECT id FROM videos WHERE id = $1", [
    videoId,
  ]);

  if (video.rows.length === 0) {
    throw new ApiError(404, "Video not found");
  }

  const result = await pool.query(
    `INSERT INTO comments (user_id, video_id, content)
     VALUES ($1, $2, $3)
     RETURNING id, user_id, video_id, content, created_at`,
    [userId, videoId, content]
  );

  return result.rows[0];
};

const getCommentsByVideoId = async (videoId: number) => {
  await getVideoById(videoId);

  const result = await pool.query(
    `SELECT comments.id, comments.user_id, users.name, comments.video_id,
            comments.content, comments.created_at
     FROM comments
     JOIN users ON users.id = comments.user_id
     WHERE comments.video_id = $1
     ORDER BY comments.created_at DESC`,
    [videoId]
  );

  return result.rows;
};

const bookmarkVideo = async (userId: number, videoId: number) => {
  const video = await pool.query("SELECT id FROM videos WHERE id = $1", [
    videoId,
  ]);

  if (video.rows.length === 0) {
    throw new ApiError(404, "Video not found");
  }

  const result = await pool.query(
    `INSERT INTO bookmarks (user_id, video_id)
     VALUES ($1, $2)
     ON CONFLICT (user_id, video_id) DO NOTHING
     RETURNING user_id, video_id`,
    [userId, videoId]
  );

  return {
    bookmarked: true,
    alreadyBookmarked: result.rows.length === 0,
  };
};

export {
  createVideo,
  getVideos,
  getVideoById,
  likeVideo,
  createComment,
  getCommentsByVideoId,
  bookmarkVideo,
};
