# 🎓 Campus Event Management System (CEMS)

**CEMS** is a full-stack enterprise-grade platform designed to streamline event discovery and registration within a campus ecosystem. It provides a seamless interface for students to find events and a robust backend to manage event data and user authentication.

[![Deployment Status](https://img.shields.io/badge/Deployment-Live-brightgreen)](https://classy-faun-6b1036.netlify.app)
[![Tech Stack](https://img.shields.io/badge/Stack-Spring%20Boot%20%7C%20React%20%7C%20MySQL-blue)](https://github.com/adigoppulasanjana13-eng/Campus-Event-management-System)

---

## 🌐 Live Application
The application is fully deployed and available at the following endpoints:

| Component | Live URL |
| :--- | :--- |
| **Frontend (User Interface)** | [👉 Visit Live Site](https://classy-faun-6b1036.netlify.app) |
| **Backend (REST API)** | [👉 API Documentation/Endpoint](https://campus-event-management-system-dsi3.onrender.com) |

---

## ✨ Key Features

- **Event Discovery:** A dynamic dashboard allowing users to browse upcoming campus events with real-time filtering.
- **Secure Authentication:** Industry-standard **JWT (JSON Web Token)** implementation for secure user sign-up and login.
- **Event Registration:** One-click registration system with capacity tracking.
- **Responsive Design:** Fully optimized for desktop and mobile using **Tailwind CSS**.
- **Enterprise Architecture:** Built with a decoupled frontend and backend for high scalability and maintainability.

---

## 🛠 Technical Stack

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State Management:** React Hooks & Axios for API communication

### Backend
- **Framework:** Spring Boot 3 (Java 17)
- **Security:** Spring Security & JWT
- **Persistence:** Spring Data JPA / Hibernate
- **Build Tool:** Maven

### Infrastructure
- **Database:** MySQL 8.0
- **Frontend Hosting:** Netlify
- **Backend Hosting:** Render
- **Version Control:** GitHub

---

## 📁 Project Structure

```text
tt final project/
├── backend/            # Spring Boot 3 REST API
│   ├── src/            # Application source code
│   ├── pom.xml         # Maven dependencies
│   └── Dockerfile      # Containerization config
├── frontend/           # React 18 SPA
│   ├── src/            # React components & logic
│   ├── package.json    # Node dependencies
│   └── vite.config.js   # Vite configuration
└── README.md           # Master documentation
```

---

## ⚙️ Local Installation & Setup

### Backend Setup
1. Navigate to the `backend` directory.
2. Update `src/main/resources/application.properties` with your local MySQL credentials.
3. Run the application:
```bash
   ./mvnw spring-boot:run
```

### Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies:
```bash
   npm install
```
3. Create a `.env` file and add your backend URL:
```env
   VITE_API_BASE_URL=http://localhost:8080/api
```
4. Start the development server:
```bash
   npm run dev
```

---

## 🛡 Security Implementation
The system employs a stateless authentication mechanism using **JWT**. 
- **User Login** $\rightarrow$ Backend validates credentials $\rightarrow$ Returns signed JWT.
- **Protected Requests** $\rightarrow$ Frontend attaches JWT to Authorization Header $\rightarrow$ Backend validates token.

---

## 👤 Author
**Sanjana** - [GitHub Profile](https://github.com/adigoppulasanjana13-eng)
