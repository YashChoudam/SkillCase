# Skillcase Intern Assessment Project Plan

## Goal
Build a mini short-video learning platform with:
- Backend: Node.js, Express, TypeScript, PostgreSQL, JWT auth.
- Frontend: React, Vite, Redux Toolkit, React Router, Axios.
- Video feed: vertical shorts UI with autoplay, likes, comments, bookmarks.

## Chronological Steps

### 1. Read requirements and prepare repository
- Keep `Backend/` and `Frontend/` in the same GitHub repository.
- Do not commit video files.
- Ensure `.gitignore` excludes:
  - `node_modules/`
  - `.env`
  - `Backend/uploads/`
- Create `Backend/uploads/` locally for the 3 provided videos.
- Download the 3 Google Drive videos and place them inside `Backend/uploads/`.

### 2. Create PostgreSQL database
- Use Supabase or Neon.
- Create a new PostgreSQL project/database.
- Copy the database connection string.
- Store it in `Backend/.env` as `DATABASE_URL`.
- Also add:
  - `JWT_SECRET`
  - `PORT`
  - `CLIENT_URL`

### 3. Add SQL schema file
- Create a schema file such as `Backend/src/config/schema.sql` or `Backend/models/schema.sql`.
- Define these tables:
  - `users`
  - `videos`
  - `likes`
  - `comments`
  - `bookmarks`
- Add primary keys and foreign keys.
- Add composite primary keys for:
  - `likes(user_id, video_id)`
  - `bookmarks(user_id, video_id)`
- Add an index on `videos(category)`.
- Add `like_count INTEGER DEFAULT 0` to `videos`.

### 4. Install backend database dependencies
- Install PostgreSQL driver:
  - `pg`
  - `@types/pg`
- Optional but useful:
  - `tsx`
  - `nodemon`
- Add backend scripts:
  - `dev`
  - `build`
  - `start`

### 5. Build backend folder structure
Create this mandatory structure inside `Backend/src/`:
- `routes/`
- `controllers/`
- `services/`
- `middlewares/`
- `config/`
- `utils/`

Keep rules:
- Routes only define endpoints.
- Controllers handle request/response.
- Services contain business logic.
- Database access stays in services or config helpers.
- Shared error and response helpers go in `utils/`.

### 6. Configure backend app
- Create Express app setup in `Backend/app.ts` or `Backend/src/app.ts`.
- Add:
  - `cors`
  - `express.json()`
  - static serving for videos: `/uploads`
  - route registration
  - centralized error middleware
- Create server startup in `Backend/index.ts` or `Backend/src/index.ts`.

### 7. Configure PostgreSQL connection
- Create `Backend/src/config/db.ts`.
- Use `pg.Pool`.
- Read `DATABASE_URL` from environment variables.
- Export a query helper or pool.

### 8. Implement authentication backend
Endpoints:
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

Implementation requirements:
- Validate request body using `zod`.
- Hash passwords with `bcrypt`.
- Store user records in PostgreSQL.
- Compare password during login.
- Issue JWT on successful login.
- Protect `/auth/me` with auth middleware.
- Return proper status codes:
  - `201` register success
  - `200` login success
  - `400` validation errors
  - `401` invalid credentials/token
  - `409` duplicate email

### 9. Implement JWT middleware
- Create `Backend/src/middlewares/authMiddleware.ts`.
- Read token from `Authorization: Bearer <token>`.
- Verify token using `JWT_SECRET`.
- Attach authenticated user info to the request.
- Reject missing or invalid tokens with `401`.

### 10. Implement video backend
Endpoints:
- `POST /videos` protected
- `GET /videos`
- `GET /videos/:id`

Implementation requirements:
- Store video metadata in the `videos` table.
- `file_path` should point to the local static video URL, for example `/uploads/video1.mp4`.
- Return all videos ordered by `created_at DESC`.
- Validate `title`, `description`, `category`, and `file_path`.

### 11. Seed initial video records
- Insert the 3 downloaded videos into the `videos` table.
- Match each database row with the local file path in `Backend/uploads/`.
- Confirm each video is accessible from the browser through the Express static URL.

### 12. Implement likes
Endpoint:
- `POST /videos/:id/like`

Implementation requirements:
- Protected route.
- Prevent duplicate likes using the composite primary key.
- Use a database transaction.
- Insert into `likes`.
- Atomically increment `videos.like_count`.
- Return updated like state/count.

### 13. Implement comments
Endpoints:
- `POST /videos/:id/comment`
- `GET /videos/:id/comments`

Implementation requirements:
- Posting comments must be protected.
- Validate comment content.
- Store `user_id`, `video_id`, `content`, and `created_at`.
- Return comments ordered by `created_at DESC` or ASC depending on UI choice.

### 14. Implement bookmarks
Endpoint:
- `POST /videos/:id/bookmark`

Implementation requirements:
- Protected route.
- Prevent duplicate bookmarks using the composite primary key.
- Return bookmark state.

### 15. Add centralized backend error handling
- Create `Backend/src/middlewares/errorMiddleware.ts`.
- Handle validation errors, auth errors, database errors, and unknown errors.
- Avoid leaking sensitive server details.
- Use consistent JSON error format.

### 16. Test backend manually
Use Postman, Insomnia, Thunder Client, or curl.
Test in this order:
- Register user.
- Login user.
- Call `/auth/me` with token.
- Create/list/get videos.
- Like a video twice and confirm duplicate prevention.
- Add comments and fetch comments.
- Bookmark a video twice and confirm duplicate prevention.
- Confirm videos stream from `/uploads/...`.

### 17. Prepare frontend project
- Use React + Vite.
- Install required dependencies:
  - `@reduxjs/toolkit`
  - `react-redux`
  - `react-router-dom`
  - `axios`
  - `framer-motion`
  - icon library such as `lucide-react`

### 18. Build frontend folder structure
Create this mandatory structure inside `Frontend/src/`:
- `pages/`
- `components/`
- `redux/`
- `api/`
- `hooks/`

### 19. Configure frontend API layer
- Create centralized Axios client in `Frontend/src/api/`.
- Use `VITE_API_URL`.
- Attach JWT token from Redux/localStorage to requests.
- Handle API errors consistently.

### 20. Configure frontend auth state
- Create Redux auth slice.
- Store:
  - user
  - token
  - loading
  - error
- Implement login/register/logout flows.
- Persist token in localStorage.
- Restore auth state on app load using `/auth/me`.

### 21. Add React Router pages
Recommended pages:
- Login page.
- Register page.
- Shorts feed page.
- Optional protected route wrapper.

### 22. Build vertical shorts feed
Requirements:
- Full-screen vertical layout.
- One video visible at a time.
- Vertical scroll snapping.
- Autoplay video when in view.
- Pause videos that are not visible.
- Smooth transitions between videos.
- Minimal modern UI.

### 23. Add video overlay actions
For each video show:
- Like button.
- Comment button.
- Bookmark button.
- Title.
- Description.
- Category.
- Like count.

Implementation requirements:
- Like button uses optimistic UI update.
- Comment button opens slide-up bottom sheet.
- Bookmark button calls backend.
- Show loading and error states.

### 24. Build comment bottom sheet
- Use a slide-up panel.
- Fetch comments for the selected video.
- Show existing comments.
- Add input to post a new comment.
- Update comment list after successful post.

### 25. Polish frontend UX
- Add subtle Framer Motion animations.
- Keep animations lightweight.
- Add loading states for feed and comments.
- Add error messages for failed API calls.
- Make UI responsive for mobile and desktop.

### 26. Final verification
Check these before submission:
- Backend starts successfully.
- Frontend starts successfully.
- Register/login works.
- Protected routes reject missing token.
- Videos load from local backend uploads.
- Feed scrolls vertically.
- Autoplay works only for visible video.
- Like/comment/bookmark work.
- Duplicate likes/bookmarks are prevented.
- `like_count` increments atomically.
- `.env` and `Backend/uploads/` are not tracked by Git.

### 27. Write README
Include:
- Project overview.
- Tech stack.
- Backend setup steps.
- Frontend setup steps.
- Environment variable examples.
- Database schema instructions.
- Architecture explanation.
- Commands to run backend and frontend.
- Note that videos must be downloaded locally and are excluded from GitHub.

### 28. Prepare GitHub submission
- Run final tests manually.
- Check `git status`.
- Ensure no video files or `.env` files are staged.
- Push repository to GitHub.
- Submit GitHub repository link.

## Suggested Build Order
1. Database schema.
2. Backend setup and health route.
3. Auth APIs.
4. Video APIs and static video serving.
5. Like/comment/bookmark APIs.
6. Backend manual testing.
7. Frontend setup.
8. Auth UI and Redux state.
9. Shorts feed.
10. Like/comment/bookmark UI.
11. README and final cleanup.

## Important Notes
- Supabase is PostgreSQL, so use the normal PostgreSQL connection string with `pg`.
- Do not use Supabase Storage for this assignment because the PDF says videos must be stored locally in the backend and served by Express static middleware.
- Keep business logic out of route files.
- Use transactions for like operations because `likes` insert and `videos.like_count` update must stay consistent.
- Never push `Backend/uploads/` or `.env` to GitHub.
