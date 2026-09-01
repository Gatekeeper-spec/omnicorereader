-- OmniReader schema — personal library, clubs, sessions, wishlist.

create table if not exists profiles (
  user_id text primary key,
  display_name text not null,
  avatar_url text,
  bio text not null default '',
  seeded boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists books (
  id text primary key,
  user_id text not null,
  title text not null,
  author text not null default '',
  isbn text,
  cover_url text,
  format text not null default 'book',
  genre text,
  publisher text,
  year int,
  total_units int not null default 0,
  unit_type text not null default 'pages',
  status text not null default 'to_read',
  progress int not null default 0,
  ongoing boolean not null default false,
  rating int,
  review text,
  started_at timestamptz,
  finished_at timestamptz,
  last_location text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists books_user_id_idx on books (user_id);
create index if not exists books_user_status_idx on books (user_id, status);

create table if not exists wishlist (
  id text primary key,
  user_id text not null,
  title text not null,
  author text not null default '',
  isbn text,
  cover_url text,
  format text,
  priority text not null default 'medium',
  estimated_price int,
  notes text,
  created_at timestamptz not null default now()
);
create index if not exists wishlist_user_id_idx on wishlist (user_id);

create table if not exists reading_sessions (
  id text primary key,
  user_id text not null,
  book_id text not null,
  started_at timestamptz not null default now(),
  duration_sec int not null default 0,
  units_read int not null default 0,
  day date not null
);
create index if not exists sessions_user_day_idx on reading_sessions (user_id, day);
create index if not exists sessions_book_idx on reading_sessions (book_id);

create table if not exists clubs (
  id text primary key,
  name text not null,
  description text not null default '',
  invite_code text not null unique,
  owner_id text not null,
  selection_mode text not null default 'vote',
  member_limit int not null default 40,
  created_at timestamptz not null default now()
);
create index if not exists clubs_owner_idx on clubs (owner_id);
create index if not exists clubs_invite_idx on clubs (invite_code);

create table if not exists club_members (
  club_id text not null,
  user_id text not null,
  role text not null default 'member',
  joined_at timestamptz not null default now(),
  primary key (club_id, user_id)
);
create index if not exists club_members_user_idx on club_members (user_id);

create table if not exists club_works (
  id text primary key,
  club_id text not null,
  title text not null,
  author text not null default '',
  cover_url text,
  isbn text,
  format text not null default 'book',
  total_units int not null default 0,
  unit_type text not null default 'pages',
  synopsis text not null default '',
  status text not null default 'nominated',
  nominated_by text not null,
  started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists club_works_club_idx on club_works (club_id);

create table if not exists club_votes (
  work_id text not null,
  user_id text not null,
  created_at timestamptz not null default now(),
  primary key (work_id, user_id)
);

create table if not exists club_progress (
  club_id text not null,
  user_id text not null,
  work_id text not null,
  progress int not null default 0,
  updated_at timestamptz not null default now(),
  primary key (club_id, user_id, work_id)
);

create table if not exists club_posts (
  id text primary key,
  club_id text not null,
  work_id text,
  user_id text not null,
  body text not null,
  spoiler boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists club_posts_club_idx on club_posts (club_id, created_at);

create table if not exists club_ratings (
  work_id text not null,
  user_id text not null,
  rating int not null,
  review text,
  primary key (work_id, user_id)
);
