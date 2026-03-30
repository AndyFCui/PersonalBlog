-- ============================================
-- Supabase Database Schema for Personal Blog
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- BLOGS TABLE - Blog posts management
-- ============================================
CREATE TABLE IF NOT EXISTS blogs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image VARCHAR(500),
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read published blogs
CREATE POLICY "Public read published blogs"
  ON blogs FOR SELECT
  USING (published = true);

-- Policy: Only authenticated users can insert/update/delete
CREATE POLICY "Admin can manage blogs"
  ON blogs FOR ALL
  USING (auth.role() = 'authenticated');

-- ============================================
-- RESUME TABLE - Resume data management
-- ============================================
CREATE TABLE IF NOT EXISTS resume (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  section VARCHAR(50) NOT NULL,  -- 'main', 'resume', 'portfolio'
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE resume ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read resume data
CREATE POLICY "Public read resume"
  ON resume FOR SELECT
  USING (true);

-- Policy: Only authenticated users can modify
CREATE POLICY "Admin can manage resume"
  ON resume FOR ALL
  USING (auth.role() = 'authenticated');

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs(published);
CREATE INDEX IF NOT EXISTS idx_blogs_published_at ON blogs(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_resume_section ON resume(section);

-- ============================================
-- FUNCTION - Auto-update updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for blogs
DROP TRIGGER IF EXISTS update_blogs_updated_at ON blogs;
CREATE TRIGGER update_blogs_updated_at
  BEFORE UPDATE ON blogs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for resume
DROP TRIGGER IF EXISTS update_resume_updated_at ON resume;
CREATE TRIGGER update_resume_updated_at
  BEFORE UPDATE ON resume
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SEED DATA - Initial resume data
-- ============================================

-- Insert main section
INSERT INTO resume (section, data) VALUES ('main', '{"name":"Andy (Xiang-Yu) Cui","occupation":"Senior Full Stack Software Engineer","description":"","image":"profilepic.jpg","intro":{"role":"Senior Full Stack Software Engineer","company":"King 7 Club Corp"},"bio":"Integrating state-of-the-art design and development practices...","skills":[{"category":"Cloud & DevOps","items":[{"name":"AWS","image":"images/logos/aws.png"},{"name":"Docker","image":"images/logos/docker.png"}]}],"contactmessage":"光而不耀，静水流深。","email":"xiangyucui@outlook.com","phone":"(402)-853-3000","city":"Waltham","nameUnderImage":"Andy Cui","address":{"street":"","city":"Waltham","state":"Massachusetts","zip":""},"website":"andyfcui","resumedownload":"images/CUIXIANGYU.pdf","social":[{"name":"linkedin","url":"https://www.linkedin.com/in/andyfcui/","className":"fa fa-linkedin"},{"name":"github","url":"https://github.com/AndyFCui","className":"fa fa-github"}]}')
ON CONFLICT DO NOTHING;

-- Insert resume section
INSERT INTO resume (section, data) VALUES ('resume', '{"skillmessage":"Skills overview","education":[{"school":"Northeastern University","degree":"Master of Science in Artificial Intelligence","graduated":"Dec 2023","Coursework":"NLP, Machine Learning","description":"","image":"education.jpg","honor":"","awards":""}],"work":[{"company":"King 7 Club Corp","title":"Senior Full Stack Software Engineer","years":"Jan 2025 - Present","image":"kingsclub.png","description":["Full stack development"]}],"skills":[{"name":"Python","level":"90%"},{"name":"JavaScript","level":"80%"}]}')
ON CONFLICT DO NOTHING;

-- Insert portfolio section
INSERT INTO resume (section, data) VALUES ('portfolio', '{"projects":[{"title":"Sample Project","category":"Web Development","description":["A sample project"],"image":"project.jpg","url":"https://github.com/andy"}]}')
ON CONFLICT DO NOTHING;
