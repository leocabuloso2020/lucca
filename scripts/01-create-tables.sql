-- Create tables for the baby shower website

-- RSVP table to track guest responses
CREATE TABLE IF NOT EXISTS rsvp (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  will_attend BOOLEAN NOT NULL DEFAULT false,
  number_of_guests INTEGER DEFAULT 1,
  dietary_restrictions TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table for the congratulations wall
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  author_name VARCHAR(255) NOT NULL,
  author_email VARCHAR(255),
  message TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gifts table for gift suggestions/registry
CREATE TABLE IF NOT EXISTS gifts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price_range VARCHAR(100),
  store_link TEXT,
  image_url TEXT,
  is_purchased BOOLEAN DEFAULT false,
  purchased_by VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_rsvp_created_at ON rsvp(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_approved ON messages(is_approved);
CREATE INDEX IF NOT EXISTS idx_gifts_purchased ON gifts(is_purchased);

-- Adding Row Level Security policies for public access
-- Enable RLS on all tables
ALTER TABLE rsvp ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE gifts ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access (since this is a public baby shower site)
-- RSVP policies
CREATE POLICY "Allow public read access to rsvp" ON rsvp FOR SELECT USING (true);
CREATE POLICY "Allow public insert to rsvp" ON rsvp FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to rsvp" ON rsvp FOR UPDATE USING (true);

-- Messages policies
CREATE POLICY "Allow public read approved messages" ON messages FOR SELECT USING (is_approved = true);
CREATE POLICY "Allow public insert messages" ON messages FOR INSERT WITH CHECK (true);

-- Gifts policies
CREATE POLICY "Allow public read access to gifts" ON gifts FOR SELECT USING (true);
CREATE POLICY "Allow public update gifts" ON gifts FOR UPDATE USING (true);
