# Campus Event Management System (CEMS) - Frontend

Modern, high-performance React application built with Vite, Tailwind CSS, Lucide icons, and Axios. Provides a fluid, interactive user experience for campus students and event administrators.

---

## 🌟 Key Features

- **Dynamic Event Discovery**: Browse events with real-time category filtering (Hackathons, Workshops, Cultural, Seminars, Sports) and live search bar.
- **One-Click Quick Login**: Instant switch between **Admin** (`admin@campus.edu`) and **Student** (`alex.rivera@campus.edu`) test credentials.
- **Student Ticket Management**: Book event tickets with instantaneous seat updates, view registered tickets modal, and cancel bookings.
- **Admin Control Center**:
  - Create new campus events with custom banner URLs, venues, dates, and capacities.
  - Edit and delete existing events.
  - View real-time attendee rosters for every event.
- **Responsive & Modern UI**: Tailwind CSS glassmorphic aesthetic with dark accents, badges, capacity bars, and toast notifications.
- **Production SPA Ready**: Configured for instant deployment on Vercel or Netlify with routing fallbacks (`vercel.json` & `_redirects`).

---

## 🛠 Tech Stack

- **Framework**: React 18
- **Bundler & Dev Server**: Vite 5
- **Styling**: Tailwind CSS & PostCSS
- **Icons**: Lucide React
- **HTTP Client**: Axios with interceptors for JWT injection and 401 handling
- **Hosting Target**: Vercel, Netlify, or Cloudflare Pages

---

## 💻 Running Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional for local)
By default, the Vite dev server proxies `/api` requests to `http://localhost:8080`.
If your backend is running on a different port or hosted URL, create `.env.local`:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### 3. Start Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 🌐 Deploying Frontend (Vercel / Netlify)

### Option A: Deploy to Vercel (Recommended - Takes 1 minute)
1. Push this `frontend` folder to a new GitHub repository (see instructions below).
2. Go to [Vercel.com](https://vercel.com) and click **Add New...** -> **Project**.
3. Import your frontend GitHub repository.
4. Framework Preset: **Vite**.
5. Under **Environment Variables**, add:
   - `VITE_API_BASE_URL`: The URL of your deployed backend API (e.g. `https://your-backend.onrender.com/api`).
6. Click **Deploy**. Vercel will generate your live production URL (e.g. `https://campus-events.vercel.app`)!

### Option B: Deploy to Netlify
1. Go to [Netlify.com](https://netlify.com) and click **Add new site** -> **Import an existing project**.
2. Select your frontend GitHub repository.
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Under **Environment variables**, set `VITE_API_BASE_URL` to your backend URL + `/api`.
6. Click **Deploy site**.

---

## 📤 Pushing Frontend Separately to GitHub

To push **only this frontend** into its own GitHub repository:

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Initialize git
git init -b main

# 3. Stage and commit
git add .
git commit -m "feat: initial commit of Campus Event Management Frontend"

# 4. Link to your new GitHub repository
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_FRONTEND_REPO_NAME>.git

# 5. Push to GitHub
git push -u origin main
```
