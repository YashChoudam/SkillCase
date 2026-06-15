-- USERS TABLE
create table if not exists users (
  id bigserial primary key,
  name varchar(100) not null,
  email varchar(255) not null unique,
  password_hash text not null,
  created_at timestamptz not null default now()
);

-- VIDEOS TABLE
create table if not exists videos (
  id bigserial primary key,
  title varchar(255) not null,
  description text not null,
  category varchar(100) not null,
  file_path text not null,
  like_count integer not null default 0,
  created_at timestamptz not null default now()
);

-- Required index on category
create index if not exists idx_videos_category
on videos(category);

-- LIKES TABLE
create table if not exists likes (
  user_id bigint not null,
  video_id bigint not null,
  created_at timestamptz not null default now(),

  primary key (user_id, video_id),

  constraint fk_likes_user
    foreign key (user_id)
    references users(id)
    on delete cascade,

  constraint fk_likes_video
    foreign key (video_id)
    references videos(id)
    on delete cascade
);

-- COMMENTS TABLE
create table if not exists comments (
  id bigserial primary key,
  user_id bigint not null,
  video_id bigint not null,
  content text not null,
  created_at timestamptz not null default now(),

  constraint fk_comments_user
    foreign key (user_id)
    references users(id)
    on delete cascade,

  constraint fk_comments_video
    foreign key (video_id)
    references videos(id)
    on delete cascade
);

-- BOOKMARKS TABLE
create table if not exists bookmarks (
  user_id bigint not null,
  video_id bigint not null,
  created_at timestamptz not null default now(),

  primary key (user_id, video_id),

  constraint fk_bookmarks_user
    foreign key (user_id)
    references users(id)
    on delete cascade,

  constraint fk_bookmarks_video
    foreign key (video_id)
    references videos(id)
    on delete cascade
);