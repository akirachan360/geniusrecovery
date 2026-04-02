# Genius Recovery ED Dashboard

A real-time, collaborative Executive Director dashboard for tracking grants, partners, media opportunities, events, and action items.

## Features

- 📊 **Overview Dashboard** - Quick stats and priority items at a glance
- 💰 **Grant Pipeline** - Track opportunities from research to submission
- 🤝 **Partner Management** - Manage prospect organizations and outreach
- 🎙️ **Media Opportunities** - Track podcast appearances and press
- 📅 **Events Calendar** - Conferences and summits with deadlines
- ✅ **Task Management** - Collaborative to-do list with due dates
- 🔄 **Real-time Sync** - All team members see updates instantly
- 📱 **Mobile Responsive** - Works on phones, tablets, and desktop

---

## Quick Start (15 minutes)

### Step 1: Create a Supabase Project (Free)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click **"New Project"**
3. Name it `genius-recovery-dashboard`
4. Set a database password (save this somewhere)
5. Choose the region closest to you
6. Click **"Create new project"** (takes ~2 minutes)

### Step 2: Set Up the Database

1. In your Supabase dashboard, click **"SQL Editor"** in the sidebar
2. Click **"New Query"**
3. Copy the ENTIRE contents of `supabase-schema.sql` and paste it
4. Click **"Run"** (green play button)
5. You should see "Success" messages

### Step 3: Get Your API Keys

1. In Supabase, go to **Settings** (gear icon) → **API**
2. Copy these two values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

### Step 4: Deploy to Vercel (Free)

1. Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. Click **"Add New..."** → **"Project"**
3. Import this repository (or upload the folder)
4. Before deploying, click **"Environment Variables"** and add:
   ```
   NEXT_PUBLIC_SUPABASE_URL = your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY = your_anon_key
   ```
5. Click **"Deploy"**
6. Wait ~2 minutes, then you'll get a live URL!

### Step 5: Share with Your Team

Your dashboard is now live at something like:
```
https://genius-recovery-dashboard.vercel.app
```

Share this URL with anyone on your team. They can:
- View all data
- Update statuses
- Add tasks
- Export data

---

## Local Development

```bash
# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local
# Edit .env.local with your Supabase keys

# Run locally
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
genius-recovery-dashboard/
├── src/
│   ├── lib/
│   │   └── supabase.js      # Supabase client
│   ├── pages/
│   │   ├── _app.js          # App wrapper
│   │   └── index.js         # Main dashboard
│   └── styles/
│       └── globals.css      # Global styles
├── public/                   # Static assets
├── supabase-schema.sql      # Database schema
├── package.json
├── next.config.js
├── tailwind.config.js
└── README.md
```

---

## Adding New Data

### Via the Dashboard
- Click "Add" buttons to add tasks
- Update statuses using dropdowns

### Via Supabase Dashboard
1. Go to your Supabase project
2. Click **"Table Editor"**
3. Select a table (grants, partners, etc.)
4. Click **"Insert row"**
5. Fill in the fields and save

### Via SQL
```sql
INSERT INTO grants (title, funder, amount, deadline, fit, status)
VALUES ('New Grant Name', 'Funder Org', '$50,000', '2026-06-15', 'high', 'pipeline');
```

---

## Customization

### Change the Colors
Edit `tailwind.config.js`:
```js
colors: {
  'genius-red': '#YOUR_COLOR',
  'genius-red-dark': '#YOUR_DARKER_COLOR',
}
```

### Add New Categories
1. Add a new table in Supabase (similar to existing ones)
2. Add a new tab in `src/pages/index.js`
3. Create a new item component

---

## Security Notes

- The current setup allows public read/write access
- For production with sensitive data, consider:
  - Adding Supabase Auth for user login
  - Restricting Row Level Security policies
  - Using environment variables for all secrets

---

## Support

Built for Genius Recovery by Claude. For updates or modifications, return to the Claude conversation and ask for changes!

---

## License

MIT - Feel free to modify and use as needed.
