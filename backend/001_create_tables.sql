-- Run this migration to add platform tables (Postgres)
-- Adjust schema and types to fit your environment

-- profiles extension (one-to-one with users)
CREATE TABLE IF NOT EXISTS profiles (
  user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  display_name TEXT,
  level INTEGER DEFAULT 1,
  pfp_url TEXT,
  bio TEXT,
  last_seen TIMESTAMP
);

-- trait categories and traits
CREATE TABLE IF NOT EXISTS trait_categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS traits (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES trait_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  asset_url TEXT,
  rarity TEXT DEFAULT 'common',
  unlock_requirement JSONB DEFAULT '{}' -- e.g. {"type":"achievement","key":"bench_100"}
);

-- user's selected avatar traits (one row per selected trait)
CREATE TABLE IF NOT EXISTS user_avatar_traits (
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  trait_id INTEGER REFERENCES traits(id),
  PRIMARY KEY (user_id, trait_id)
);

-- rituals (workout types) and scheduled sessions
CREATE TABLE IF NOT EXISTS rituals (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  points INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS ritual_sessions (
  id SERIAL PRIMARY KEY,
  ritual_id INTEGER REFERENCES rituals(id),
  user_id INTEGER REFERENCES users(id),
  scheduled_at TIMESTAMP,
  completed_at TIMESTAMP,
  result JSONB,
  points_awarded INTEGER DEFAULT 0
);

-- quests and user quests
CREATE TABLE IF NOT EXISTS quests (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  reward JSONB -- e.g. {"type":"trait","trait_id":42} or {"xp":100}
);

CREATE TABLE IF NOT EXISTS user_quests (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  quest_id INTEGER REFERENCES quests(id),
  status TEXT DEFAULT 'in_progress',
  completed_at TIMESTAMP
);

-- achievements and user achievements
CREATE TABLE IF NOT EXISTS achievements (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  name TEXT,
  description TEXT,
  reward JSONB -- e.g. {"grant_trait_id": 10}
);

CREATE TABLE IF NOT EXISTS user_achievements (
  user_id INTEGER REFERENCES users(id),
  achievement_id INTEGER REFERENCES achievements(id),
  unlocked_at TIMESTAMP DEFAULT now(),
  PRIMARY KEY (user_id, achievement_id)
);

-- chat messages
CREATE TABLE IF NOT EXISTS chat_messages (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);
