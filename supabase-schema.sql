-- Genius Recovery ED Dashboard Database Schema
-- Run this in your Supabase SQL Editor (https://app.supabase.com > SQL Editor)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Policy Updates Table
CREATE TABLE policy_updates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  date DATE,
  link TEXT,
  action_items TEXT[], -- Array of action items
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Grants Table
CREATE TABLE grants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  funder TEXT,
  amount TEXT,
  deadline TEXT, -- Can be date or 'Rolling'
  fit TEXT DEFAULT 'medium' CHECK (fit IN ('high', 'medium', 'low')),
  requirements TEXT,
  link TEXT,
  status TEXT DEFAULT 'pipeline' CHECK (status IN ('pipeline', 'researching', 'applying', 'submitted', 'awarded', 'declined')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Partner Organizations Table
CREATE TABLE partners (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT,
  description TEXT,
  contact TEXT,
  fit TEXT DEFAULT 'medium' CHECK (fit IN ('high', 'medium', 'low')),
  status TEXT DEFAULT 'prospect' CHECK (status IN ('prospect', 'outreach', 'active', 'inactive')),
  service_needs TEXT[], -- Array of service needs
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Media Opportunities Table
CREATE TABLE media (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  host TEXT,
  platform TEXT,
  audience TEXT,
  fit TEXT DEFAULT 'medium' CHECK (fit IN ('high', 'medium', 'low')),
  status TEXT DEFAULT 'prospect' CHECK (status IN ('prospect', 'pitched', 'scheduled', 'completed')),
  notes TEXT,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events Table
CREATE TABLE events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  location TEXT,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  event_type TEXT DEFAULT 'conference',
  status TEXT DEFAULT 'considering' CHECK (status IN ('considering', 'registered', 'attending', 'attended')),
  notes TEXT,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks Table
CREATE TABLE tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  due_date DATE,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  notes TEXT,
  assigned_to TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity Log (for tracking changes across team)
CREATE TABLE activity_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_name TEXT,
  action TEXT NOT NULL, -- 'created', 'updated', 'deleted'
  table_name TEXT NOT NULL,
  record_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dashboard Settings (for org-wide settings)
CREATE TABLE settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE policy_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust for your needs)
-- For a team dashboard without auth, allow all operations
CREATE POLICY "Allow all operations on policy_updates" ON policy_updates FOR ALL USING (true);
CREATE POLICY "Allow all operations on grants" ON grants FOR ALL USING (true);
CREATE POLICY "Allow all operations on partners" ON partners FOR ALL USING (true);
CREATE POLICY "Allow all operations on media" ON media FOR ALL USING (true);
CREATE POLICY "Allow all operations on events" ON events FOR ALL USING (true);
CREATE POLICY "Allow all operations on tasks" ON tasks FOR ALL USING (true);
CREATE POLICY "Allow all operations on activity_log" ON activity_log FOR ALL USING (true);
CREATE POLICY "Allow all operations on settings" ON settings FOR ALL USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_policy_updates_updated_at BEFORE UPDATE ON policy_updates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_grants_updated_at BEFORE UPDATE ON grants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON partners FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_media_updated_at BEFORE UPDATE ON media FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial data
INSERT INTO policy_updates (title, description, priority, date, link, action_items) VALUES
('Great American Recovery Initiative', 'Executive Order 14379 signed Jan 29, 2026. Co-chaired by HHS Secretary Kennedy and Senior Advisor Kathryn Burgum. Treats addiction as chronic, treatable disease.', 'high', '2026-01-29', 'https://www.whitehouse.gov/presidential-actions/2026/01/addressing-addiction-through-the-great-american-recovery-initiative/', ARRAY['Position as capacity-building partner', 'Align messaging with federal priorities']),
('STREETS Initiative - $100M Investment', 'HHS announced $100M for homeless outreach, psychiatric care, and recovery housing. SAMHSA also releasing $794M in 2026 block grants.', 'high', '2026-02-02', 'https://www.hhs.gov/press-room/secretary-kennedy-announces-100-million-investment-great-american-recovery.html', ARRAY['Monitor SAMHSA grant announcements', 'Prepare partner orgs for funding opportunities']),
('SAMHSA Funding Volatility Alert', '$2B in grants temporarily terminated then restored in January 2026. Diversify funding sources and maintain reserves.', 'medium', '2026-01-15', NULL, ARRAY['Diversify funding sources', 'Build 3-month operating reserve']);

INSERT INTO grants (title, funder, amount, deadline, fit, requirements, link, status) VALUES
('Second Chance Act Family-Based SUD Treatment', 'Department of Justice', '$1M+', '2026-05-04', 'medium', 'Requires correctional partnership', 'https://grants.gov', 'researching'),
('California Innovation Partnership Fund', 'Commission for Behavioral Health', 'Up to $20M pool', '2026-07-01', 'high', 'Equity-centered behavioral health innovations', NULL, 'pipeline'),
('California Community Reinvestment Grants (CalCRG)', 'GO-Biz', 'Up to $3M', '2026-05-01', 'high', 'SUD treatment, job placement, reentry services', NULL, 'pipeline'),
('Draper Richards Kaplan Foundation', 'DRK Foundation', 'Multi-year', 'Rolling', 'high', 'Early-stage social entrepreneurs with scalable solutions', 'https://www.drkfoundation.org', 'researching');

INSERT INTO partners (name, location, description, contact, fit, status, service_needs) VALUES
('Sana Recovery Foundation', 'Charlotte, NC', 'New 501(c)(3) launched Feb 2026. NBA player Mike Gminski as Community Ambassador.', 'Kevin Mikolazyk, (704) 582-4295', 'high', 'outreach', ARRAY['Testimonial video', 'Social media package']),
('The Purpose of Recovery', 'Orange County, CA', 'Peer-led RCO providing free, bilingual recovery coaching. Member of ARCO, ARCC.', NULL, 'high', 'prospect', ARRAY['Fundraising video', 'Brand awareness content']),
('Release Recovery Foundation', 'California', 'Supports underrepresented communities, runs marathon fundraising team.', NULL, 'medium', 'prospect', ARRAY['Event coverage', 'Co-branded content']),
('Faces & Voices of Recovery', 'National', 'Leading recovery advocacy org. Runs ManyFaces1Voice campaign with filmmaker Greg Williams.', NULL, 'high', 'prospect', ARRAY['Content collaboration', 'Storytelling partnership']);

INSERT INTO media (name, host, platform, audience, fit, status, notes) VALUES
('Let''s Talk Addiction & Recovery', 'William C. Moyers', 'Hazelden Betty Ford', 'Industry professionals', 'high', 'prospect', 'Premier industry podcast'),
('The Addicted Mind Podcast', 'Duane Osterlind, LMFT', 'Independent', 'Clinicians + general', 'high', 'prospect', '9 years running, research + personal stories'),
('Addiction Recovery Place Podcast', 'Chris Langley', 'Independent', 'Treatment professionals', 'high', 'prospect', 'Regularly seeks guests'),
('Thriving with Addiction', 'TBD', 'New 2026 launch', 'General', 'medium', 'prospect', 'Actively seeking guests and sponsors'),
('Heart of the Matter', 'Elizabeth Vargas', 'Partnership to End Addiction', 'General/mainstream', 'high', 'prospect', 'High-profile host, celebrity guests');

INSERT INTO events (name, start_date, end_date, location, priority, event_type, status, notes) VALUES
('Rx and Illicit Drug Summit', '2026-04-06', '2026-04-09', 'Nashville, TN', 'high', 'conference', 'considering', '15 years running, broad stakeholder mix'),
('Recovery Capital Conference', '2026-10-01', '2026-10-03', 'Calgary, Canada', 'medium', 'conference', 'considering', '10th year, recovery-oriented systems of care focus'),
('NAADAC #EMPOWER2026', '2026-08-29', '2026-08-31', 'Kansas City, MO', 'high', 'conference', 'considering', 'Biggest addiction educational event, 1000+ professionals'),
('Addiction World Conference', '2026-09-18', '2026-09-20', 'Miami, FL', 'medium', 'conference', 'considering', 'Early bird ends March 31, 2026');

INSERT INTO tasks (title, category, due_date, priority, status, notes) VALUES
('Register for Recovery Capital Conference', 'events', '2026-04-01', 'high', 'pending', 'Early bird deadline'),
('Review SAMHSA FY2026 NOFOs', 'grants', '2026-04-05', 'high', 'pending', 'Check samhsa.gov/grants'),
('Reach out to Sana Recovery Foundation', 'partners', '2026-04-05', 'high', 'pending', 'Contact Kevin Mikolazyk for pilot partnership'),
('Submit speaker proposal to NAADAC', 'media', '2026-04-30', 'medium', 'pending', 'Or Addiction World Conference'),
('Draft Partner Support Initiative one-pager', 'partners', '2026-04-15', 'medium', 'pending', 'For outreach to potential partners'),
('Identify 3 podcasts for guest pitches', 'media', '2026-04-10', 'medium', 'pending', 'Pitch Genius Recovery leadership');

-- Insert last updated setting
INSERT INTO settings (key, value) VALUES ('last_updated', '{"timestamp": "' || NOW() || '"}');
