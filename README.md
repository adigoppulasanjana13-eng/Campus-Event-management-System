# Campus Event Management System (CEMS)

A full-stack enterprise campus event discovery and registration platform built with **Spring Boot 3 (Java 17)** and **React 18 (Vite + Tailwind CSS)**.

---

## 📁 Repository Structure

```
tt final project/
├── backend/            # Spring Boot 3 REST API + JWT + MySQL/H2
│   ├── src/
│   ├── pom.xml
│   ├── mvnw / mvnw.cmd
│   ├── Dockerfile
│   └── README.md
├── frontend/           # React 18 SPA + Vite + Tailwind CSS
│   ├── src/
│   ├── package.json
│   ├── vercel.json
│   └── README.md
├── pom.xml             # Root Maven aggregator POM
└── README.md           # Master documentation
```

---

## 🚀 Pushing Backend & Frontend Separately to GitHub

You can maintain separate GitHub repositories for backend and frontend as follows:

### Step 1: Create Two Repositories on GitHub
1. Go to [GitHub.com/new](https://github.com/new) and create a repository for your backend (e.g., `campus-event-backend`).
2. Create another repository for your frontend (e.g., `campus-event-frontend`).

---

### Step 2: Push Backend
Open your terminal and run:
```bash
cd "tt final project/backend"
git init -b main
git add .
git commit -m "feat: complete Spring Boot 3 backend with JWT and JPA"
git remote add origin https://github.com/<YOUR_USERNAME>/campus-event-backend.git
git push -u origin main
```

---

### Step 3: Push Frontend
Open another terminal tab or return to the root and run:
```bash
cd "tt final project/frontend"
git init -b main
git add .
git commit -m "feat: complete React Vite frontend with Tailwind CSS"
git remote add origin https://github.com/<YOUR_USERNAME>/campus-event-frontend.git
git push -u origin main
```

---

## 🌐 Deployment Instructions & Getting Live Links

### 1. Deploy the Backend First (Render / Railway)
1. Sign up / log in to [Render.com](https://render.com).
2. Click **New +** -> **Web Service** and connect `campus-event-backend`.
3. Settings:
   - **Environment**: Java (or Docker)
   - **Build Command**: `./mvnw clean package -DskipTests`
   - **Start Command**: `java -jar target/campus-event-management-1.0.0.jar`
4. Add Environment Variable:
   - `SPRING_PROFILES_ACTIVE`: `h2` *(or your MySQL credentials if using external DB)*
   - `JWT_SECRET`: `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970`
5. Click **Deploy**. When deployed, copy your backend URL, for example:
   `https://campus-event-backend.onrender.com`

---

### 2. Deploy Frontend (Vercel / Netlify)
1. Sign up / log in to [Vercel.com](https://vercel.com).
2. Click **Add New...** -> **Project** and select `campus-event-frontend`.
3. Framework Preset: **Vite**.
4. In **Environment Variables**, add:
   - Name: `VITE_API_BASE_URL`
   - Value: `https://campus-event-backend.onrender.com/api` *(Your Render backend URL with `/api`)*
5. Click **Deploy**. Vercel will give you your live URL (e.g. `https://campus-event-frontend.vercel.app`).
