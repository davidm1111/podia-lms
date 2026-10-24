-- ============================================================
-- Cloudflare D1 SQL Schema for Podia LMS (100% Free Serverless)
-- Run with: npx wrangler d1 execute lms-database --file=./schema.sql
-- ============================================================

-- Table: Courses
CREATE TABLE IF NOT EXISTS courses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT,
  description TEXT,
  badge TEXT,
  theme_color TEXT DEFAULT '#724ae8',
  price TEXT DEFAULT 'Gratis',
  instructor_name TEXT,
  instructor_title TEXT,
  instructor_avatar TEXT,
  instructor_bio TEXT,
  is_published INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Table: Sections
CREATE TABLE IF NOT EXISTS sections (
  id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE
);

-- Table: Lessons
CREATE TABLE IF NOT EXISTS lessons (
  id TEXT PRIMARY KEY,
  section_id TEXT NOT NULL,
  course_id TEXT NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  type TEXT DEFAULT 'notebook', -- 'notebook' | 'article' | 'video'
  duration_minutes INTEGER DEFAULT 15,
  summary TEXT,
  content_markdown TEXT,
  notebook_json TEXT, -- Full .ipynb JSON payload
  notebook_file_name TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (section_id) REFERENCES sections (id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE
);

-- Table: Student Progress
CREATE TABLE IF NOT EXISTS user_progress (
  user_id TEXT NOT NULL,
  course_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  completed_at TEXT DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, course_id, lesson_id)
);

-- Table: Lesson Comments & Q&A
CREATE TABLE IF NOT EXISTS lesson_comments (
  id TEXT PRIMARY KEY,
  lesson_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Indices for rapid querying
CREATE INDEX IF NOT EXISTS idx_sections_course ON sections(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_section ON lessons(section_id);
CREATE INDEX IF NOT EXISTS idx_progress_user ON user_progress(user_id, course_id);
