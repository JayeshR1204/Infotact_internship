# Enterprise HRMS & Payroll Automation Dashboard
### Built by: Infotact Solutions Intern Team × Intelleq Academy

---

## 🚀 Project Overview

A production-ready, full-stack **Human Resource Management System (HRMS)** built with:

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS v4
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MongoDB (Mongoose ODM)
- **Security**: JWT, bcrypt (12 salt rounds), Helmet.js, Rate Limiting, RBAC

---

## 🏗️ Architecture

```
hrms-payroll-project/
├── client/                  # React + Vite frontend
│   └── src/
│       ├── components/      # Sidebar, Navbar, StatCard, ProtectedRoute
│       ├── context/         # AuthContext (JWT session management)
│       └── pages/           # Login, AdminDashboard, EmployeeDashboard
└── server/                  # Express.js backend
    └── src/
        ├── config/          # MongoDB connection
        ├── middleware/       # JWT auth + RBAC middleware
        ├── models/          # User, Employee, Payroll schemas
        ├── routes/          # Auth, Employee, Payroll routers
        └── utils/           # JWT helpers, PDF generator
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js 20+
- MongoDB (local or Atlas)

### 1. Clone and Install

```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### 2. Configure Environment

```bash
cd server
# Edit .env with your MongoDB URI and JWT secret
```

### 3. Seed the Database

```bash
cd server
node seed.js
```

This creates:
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@infotact.com | Admin@2026! |
| HR Manager | priya.hr@infotact.com | Hr@2026! |
| Employee (5x) | arjun@infotact.com | Emp@2026! |

### 4. Start Development Servers

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

Visit: `http://localhost:5173`

---

## 🔐 API Endpoints

### Auth
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/api/auth/register` | Public | Register a user |
| POST | `/api/auth/login` | Public | Login + get JWT |
| GET | `/api/auth/me` | Private | Get current session |

### Employees
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | `/api/employees` | Admin/HR | All employees |
| GET | `/api/employees/profile` | Private | Own profile |
| POST | `/api/employees` | Admin/HR | Create employee |
| PUT | `/api/employees/:id` | Admin/HR | Update employee |
| DELETE | `/api/employees/:id` | Admin | Terminate employee |

### Payroll
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/api/payroll/calculate` | Admin/HR | Process payroll |
| GET | `/api/payroll/all` | Admin/HR | All payrolls |
| GET | `/api/payroll/history/:id` | Private | Employee history |
| GET | `/api/payroll/download/:id` | Private | PDF payslip |
| PATCH | `/api/payroll/:id/status` | Admin/HR | Update status |

---

## 🔒 Security Features

- **bcrypt** password hashing (12 rounds)
- **JWT** signed tokens with 24h expiry
- **HttpOnly-safe** token storage
- **Helmet.js** security headers
- **Rate limiting**: 20 auth requests / 15 min
- **RBAC**: Admin → HR Manager → Employee role hierarchy
- **Input sanitization** on all endpoints
- **User enumeration prevention** on login

---

## 📄 PDF Payslip Generation

The `/api/payroll/download/:id` endpoint streams a real branded PDF payslip using **PDFKit**, including:
- Employee details panel
- Earnings breakdown (Base + HRA + Transport + Medical)
- Deductions table (PF + Tax + Professional Tax)
- Net pay banner
- Amount in words (Indian numbering system)
- Corporate footer with branding

---

## 🧩 Git Workflow

```
main            ← Production-ready only
feature/xxx     ← Feature branches
fix/xxx         ← Bug fix branches
```

**Commit convention:**
```
feat: add PDF payslip generation (fixes #12)
fix: resolve employee profile 404 on login (fixes #8)
chore: upgrade react to v19
```

---

## 🤝 Team

Built at **Infotact Solutions** in collaboration with **Intelleq Academy**.
