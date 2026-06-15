# SkillCase Short Video Learning Platform

Mini short-video learning platform built for the Skillcase Intern Assessment.

The project contains an Express + PostgreSQL backend and a React + Vite frontend. Users can register, log in, view short videos, like videos, comment on videos, and bookmark videos.

## Tech Stack

### Backend
- Node.js
- Express
- TypeScript
- PostgreSQL using Supabase
- JWT authentication
- bcrypt password hashing
- Zod validation
- `pg` PostgreSQL driver

### Frontend
- React
- Vite
- TypeScript
- Redux Toolkit
- React Router
- Axios
- Framer Motion

## Project Structure

```txt
SkillCase/
  Backend/
    src/
      config/
        cors.config.ts
        database.config.ts
        env.config.ts
      controller/
        auth.controller.ts
        video.controller.ts
      middlewares/
        auth.middleware.ts
        error.middleware.ts
      models/
        schema.sql
      routes/
        auth.routes.ts
        video.routes.ts
      services/
        video.service.ts
      types/
        express.d.ts
      uploads/
        video1.mp4
        video2.mp4
        video3.mp4
      utils/
      validators/
      app.ts
      index.ts

  Frontend/
    skillcase-project/
      src/
        api/
        components/
        hooks/
        pages/
        redux/
```

## Architecture

The frontend never connects directly to Supabase. All database access goes through the Express backend.

```txt
React Frontend
    |
    | Axios API requests
    v
Express Backend
    |
    | pg Pool queries
    v
Supabase PostgreSQL
```

### Backend Architecture

- `routes/` defines API endpoints only.
- `controller/` handles request and response logic.
- `services/` contains database and business logic.
- `middlewares/` contains JWT authentication and centralized error handling.
- `config/` contains environment, CORS, and database configuration.
- `validators/` contains Zod schemas for request validation.
- `models/schema.sql` contains the PostgreSQL schema used in Supabase.
- `uploads/` stores local video files served through Express static middleware.

### Frontend Architecture

- `api/` contains centralized Axios configuration and API functions.
- `redux/` stores authentication and video state.
- `pages/` contains route-level screens such as feed, login, register, upload, and bookmarks.
- `components/` contains reusable UI pieces such as shorts cards, layout, category chips, and comment sheet.
- `hooks/` contains reusable frontend logic such as intersection observer behavior for video playback.

## Backend Setup

Go to the backend folder:

```bash
cd Backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside `Backend/`:

```env
PORT=5000
DATABASE_URL=your_supabase_postgres_connection_string
JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

Create the database tables in Supabase:

1. Open Supabase.
2. Go to SQL Editor.
3. Copy the SQL from `Backend/src/models/schema.sql`.
4. Run the SQL query.

Add the provided videos locally:

```txt
Backend/src/uploads/video1.mp4
Backend/src/uploads/video2.mp4
Backend/src/uploads/video3.mp4
```

Do not push video files to GitHub.

Insert video rows in Supabase:

```sql
insert into videos (title, description, category, file_path)
values
('Short 1', 'Learning short video 1', 'learning', '/uploads/video1.mp4'),
('Short 2', 'Learning short video 2', 'learning', '/uploads/video2.mp4'),
('Short 3', 'Learning short video 3', 'learning', '/uploads/video3.mp4');
```

Build the backend:

```bash
npm run build
```

Start the backend:

```bash
npm start
```

If PowerShell blocks `npm`, use:

```bash
npm.cmd run build
npm.cmd start
```

Backend runs at:

```txt
http://localhost:5000
```

## Backend API

### Auth

```txt
POST /auth/register
POST /auth/login
GET  /auth/me
```

Protected routes require:

```txt
Authorization: Bearer <token>
```

### Videos

```txt
POST /videos
GET  /videos
GET  /videos/:id
```

### Interactions

```txt
POST /videos/:id/like
POST /videos/:id/comment
GET  /videos/:id/comments
POST /videos/:id/bookmark
```

## Frontend Setup

Go to the frontend app folder:

```bash
cd Frontend/skillcase-project
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside `Frontend/skillcase-project/`:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at:

```txt
http://localhost:5173
```

## Running The Full Project

Start backend in one terminal:

```bash
cd Backend
npm run build
npm start
```

Start frontend in another terminal:

```bash
cd Frontend/skillcase-project
npm run dev
```

Open:

```txt
http://localhost:5173
```

## Git Ignore Notes

The repository should not include:

```txt
Backend/.env
Backend/node_modules/
Backend/dist/
Backend/src/uploads/
Frontend/skillcase-project/.env
Frontend/skillcase-project/node_modules/
Frontend/skillcase-project/dist/
```

Video files must stay local and must not be pushed to GitHub.

## Submission Checklist

- Backend builds successfully.
- Frontend builds successfully.
- Supabase schema is created.
- Auth APIs work.
- Video APIs work.
- Like, comment, and bookmark APIs work.
- Videos are served from Express static middleware.
- `.env` files are not committed.
- Video files are not committed.
- README contains setup and architecture instructions.
