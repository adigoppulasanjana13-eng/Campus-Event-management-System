# Campus Event Management System (CEMS) - Backend

Enterprise-grade Spring Boot 3 REST API for the Campus Event Management System. Built with Java 17, Spring Data JPA, Spring Security, JWT stateless authentication, and MySQL/H2 support.

---

## 🌟 Key Features

- **JWT Authentication & Authorization**: Secure token-based access with role-based access control (`ROLE_ADMIN`, `ROLE_STUDENT`).
- **Event Lifecycle Management**: Full CRUD operations for campus events (Hackathons, Workshops, Cultural, Seminars, Sports).
- **Ticket Booking & Real-Time Capacity**: Atomic booking transaction handling with duplicate registration guards and automatic capacity increment/decrement.
- **Auto-Bootstrapped Seed Data**: Pre-populates default admin, student accounts, and rich event datasets on initial startup.
- **Cloud Ready**: Dynamic configuration for Render, Railway, Docker, AWS, or Heroku via environment variables.

---

## 🛠 Tech Stack

- **Java**: 17 (Eclipse Temurin)
- **Framework**: Spring Boot 3.3.4
- **Security**: Spring Security 6 with JJWT 0.12.6
- **Persistence**: Spring Data JPA / Hibernate Core 6.5
- **Databases**:
  - MySQL 8.0 (Production / Local Development)
  - H2 Database (Integration Testing & Zero-Config Demo Mode)
- **Build Tool**: Maven & Maven Wrapper (`mvnw`)
- **Containerization**: Docker multi-stage build

---

## 🚀 Pre-Configured Demo Credentials

When the backend starts up for the first time, it automatically creates the following users:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@campus.edu` | `Admin@123` | Create, edit, delete events, inspect student rosters |
| **Student** | `alex.rivera@campus.edu` | `Student@123` | Browse events, book tickets, manage personal registrations |
| **Student** | `samantha.lee@campus.edu` | `Student@123` | Browse events, book tickets, manage personal registrations |

---

## 💻 Running Locally

### Prerequisites
- JDK 17 installed (`java -version`)
- MySQL running on port 3306 (or use the H2 profile below)

### Option 1: Standard MySQL Mode
1. Ensure MySQL is running on `localhost:3306` with database `campus_event_db` (or user `root` / `root`).
2. Run the application:
```bash
./mvnw spring-boot:run
```

### Option 2: Zero-Config In-Memory H2 Mode (No MySQL needed)
If you don't have MySQL installed locally, run with the `h2` profile:
```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=h2
```

The API will be available at `http://localhost:8080`.

---

## 📡 REST API Overview

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register a new student account
- `POST /api/auth/login` - Authenticate and retrieve JWT token
- `GET /api/auth/me` - Retrieve current logged-in user details

### Events (`/api/events`)
- `GET /api/events` - Get all events (supports `?category=...&search=...`)
- `GET /api/events/{id}` - Get event details by ID
- `GET /api/events/categories` - Get distinct event categories
- `POST /api/events` - Create event (*Admin only*)
- `PUT /api/events/{id}` - Update event (*Admin only*)
- `DELETE /api/events/{id}` - Delete event (*Admin only*)

### Registrations (`/api/registrations`)
- `POST /api/registrations` - Register current user for an event
- `GET /api/registrations/my-registrations` - Get all registrations for logged-in user
- `GET /api/registrations/event/{eventId}` - Get attendee roster for an event (*Admin only*)
- `DELETE /api/registrations/{id}` - Cancel an event registration

---

## 🌐 Deploying the Backend (Render / Railway)

### Deploying on Render (Free Web Service)
1. Push this `backend` folder to a new GitHub repository (see instructions below).
2. Go to [Render.com](https://render.com) and click **New +** -> **Web Service**.
3. Connect your backend GitHub repository.
4. Configure service settings:
   - **Environment**: `Java` (or `Docker`)
   - **Build Command**: `./mvnw clean package -DskipTests`
   - **Start Command**: `java -jar target/campus-event-management-1.0.0.jar`
5. Under **Environment Variables**, add:
   - For instant zero-setup demo (no MySQL required):
     - `SPRING_PROFILES_ACTIVE`: `h2`
     - `JWT_SECRET`: `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970`
   - For production with MySQL (Render PostgreSQL or external MySQL e.g. Aiven/Railway):
     - `SPRING_DATASOURCE_URL`: `jdbc:mysql://<host>:<port>/<dbname>?useSSL=true`
     - `SPRING_DATASOURCE_USERNAME`: `<username>`
     - `SPRING_DATASOURCE_PASSWORD`: `<password>`
     - `JWT_SECRET`: `<any-strong-secret-key>`
6. Deploy! Render will give you a public URL (e.g. `https://campus-backend.onrender.com`).
   *Your backend API base URL will be `https://campus-backend.onrender.com/api`.*

---

## 📤 Pushing Backend Separately to GitHub

To push **only this backend** into its own GitHub repository:

```bash
# 1. Navigate to backend directory
cd backend

# 2. Initialize git
git init -b main

# 3. Stage and commit
git add .
git commit -m "feat: initial commit of Campus Event Management Backend"

# 4. Link to your new GitHub repository
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_BACKEND_REPO_NAME>.git

# 5. Push to GitHub
git push -u origin main
```
