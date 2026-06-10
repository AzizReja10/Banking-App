# 🏦 Banking App

A full-stack banking application built with **Java Spring Boot** and **React**, featuring secure authentication, fund transfers, balance tracking, and transaction history.

🔗 **Live Demo:** [https://banking-app-5.onrender.com/login](https://banking-app-5.onrender.com/login)

---

## ✨ Features

- 🔐 **User Authentication** — Secure register and login with JWT-based auth
- 💸 **Fund Transfers** — Transfer money between accounts
- 💰 **Balance Tracking** — Real-time account balance display
- 📜 **Transaction History** — View all past transactions
- 🐳 **Dockerized** — Fully containerized for easy deployment

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | Java, Spring Boot, Spring Security |
| Authentication | JWT (JSON Web Tokens) |
| Database | PostgreSQL |
| Frontend | React |
| Containerization | Docker |
| Deployment | Render |

---

## 🏗️ Architecture

```
├── backend/               # Spring Boot REST API
│   ├── auth/              # JWT authentication & authorization
│   ├── account/           # Account management
│   ├── transaction/       # Transfer & transaction logic
│   └── config/            # Security & DB configuration
├── frontend/              # React application
│   ├── components/        # Reusable UI components
│   └── pages/             # Login, Dashboard, Transactions
└── Dockerfile             # Container configuration
```

---

## 🚀 Getting Started

### Prerequisites

- Java 17+
- Node.js 18+
- PostgreSQL
- Docker (optional)

### Run Locally

**1. Clone the repository**
```bash
git clone https://github.com/AzizReja10/Banking-App.git
cd Banking-App
```

**2. Configure the database**

Create a PostgreSQL database and update `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/banking_db
spring.datasource.username=your_username
spring.datasource.password=your_password
jwt.secret=your_jwt_secret
```

**3. Run the backend**
```bash
./mvnw spring-boot:run
```

**4. Run the frontend**
```bash
cd frontend
npm install
npm start
```

The app will be available at `http://localhost:3000`

### Run with Docker

```bash
docker build -t banking-app .
docker run -p 8080:8080 banking-app
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT token |
| GET | `/api/account/balance` | Get account balance |
| POST | `/api/transaction/transfer` | Transfer funds |
| GET | `/api/transaction/history` | Get transaction history |

---

## 📸 Screenshots

> _Add screenshots of your app here — login page, dashboard, transaction history_

---

## 🔒 Security

- Passwords are hashed using **BCrypt**
- All protected routes require a valid **JWT token** in the Authorization header
- Spring Security handles role-based access control

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
