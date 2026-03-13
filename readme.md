# Tasty Station - Enterprise Restaurant POS System 🍽️

**Tasty Station** is a high-performance, enterprise-grade Point of Sale (POS) application designed for modern restaurants. It streamlines operations from order taking to kitchen management, inventory tracking, and financial reporting. Built on the **MERN Stack** and optimized for scale with **Redis Caching** and **Server-Side Pagination**, it ensures lightning-fast performance even under heavy loads.

---

## 🚀 Live Demo

**Application URL:** [https://tastystation.vercel.app](https://tastystation.vercel.app)

### 🔑 Login Credentials

You can explore the system using the following Admin credentials:

- **Email:** `admin@me.com`
- **Password:** `12345678`

*(Cashier and Kitchen roles can also be created via the Admin panel)*

---

## 🏛️ System Architecture & Technologies

This application uses a robust, scalable architecture ensuring reliability and speed.

### **Frontend (Client-Side)**
- **Framework:** [React 19](https://react.dev/) with [Vite](https://vitejs.dev/) for ultra-fast builds.
- **Styling:** **Tailwind CSS v4** for cutting-edge, high-performance styling.
- **State Management:** [Zustand](https://github.com/pmndrs/zustand) for efficient, global state management.
- **UI Components:** **Shadcn UI** (Radix Primitives) for accessible, premium design.
- **Animations:** **Framer Motion** for smooth, professional transitions.
- **HTTP Client:** **Axios** with centralized interceptors for security and global error handling.

### **Backend (Server-Side)**
- **Runtime:** [Node.js](https://nodejs.org/) (v20+)
- **Framework:** [Express.js v5](https://expressjs.com/) for modern asynchronous routing.
- **Database:** [MongoDB Atlas](https://www.mongodb.com/) with **Mongoose** for type-safe data modeling.
- **Caching:** [Redis](https://redis.io/) (via Upstash) for high-speed data retrieval.
- **Authentication:** **JWT (JSON Web Tokens)** with HTTP-Only cookies for maximum security.
- **Image Storage:** **Cloudinary** for scalable, optimized media hosting.

---

## ✨ Key Features

### 1. ⚡ High-Performance Architecture
- **Redis Caching:** API response times under **50ms** by caching frequent queries (Menu, Stats).
- **Server-Side Pagination:** Efficiently handles thousands of records across all major modules.
- **Monorepo Workflow:** Unified project management with shared dependencies.

### 2. 📊 Powerful Analytics Dashboard
- **Real-Time Insight:** Live tracking of Sales, Orders, and Customers.
- **Visual Analytics:** Interactive charts powered by **Recharts**.
- **Historical Data:** Filterable sales trends (Daily, Weekly, Monthly).

### 3. 📦 Operations Management
- **Smart POS Terminal:** Touch-friendly grid with live category filtering and a dynamic cart.
- **Live Inventory Tracking:** Monitor stock levels with automated low-stock visual alerts.
- **Kitchen Monitor:** Real-time order status tracking for chefs and kitchen staff.

---

## 🛠️ Setup & Local Development

This project uses a unified script system to manage the monorepo:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/hey-Zayn/POS.git
   cd POS
   ```

2. **One-Command Installation:**
   ```bash
   npm run install:all
   ```

3. **Combined Development Server:**
   ```bash
   # Starts Backend (3000) and Frontend (5173) simultaneously
   npm run dev
   ```

> [!IMPORTANT]
> Ensure you copy `backend/.env.example` to `backend/.env` and provide your credentials (MongoDB, Redis, JWT_SECRET, Cloudinary) before starting the server.

---

## 🚀 DevOps & CI/CD
We implement a **Production-Grade Pipeline** using GitHub Actions:

### **Continuous Integration (CI)**
- **Quality Gates**: Every push/PR triggers an automated ESLint scan ensuring code quality.
- **Build Checks**: Full production build verification for both Frontend and Backend.
- **Syntax Validation**: Ensures all Node.js modules are syntax-healthy before deployment.

### **Continuous Deployment (CD)**
- **Preview Environments**: Automated Vercel Preview deployments for every Pull Request.
- **Production Edge**: Automated deployment to the live URL upon merging to `main`.

---

## 🤝 Developer Guidelines
To keep the pipeline green:
- **Linting**: Run `npm run lint` in the `frontend` folder before pushing.
    - We follow strict Rules (no unused variables, proper hook dependencies).
- **Environment**: Never commit `.env` files. Use `.env.example` as a template.
- **Style**: Use Tailwind utility classes; avoid inline styles for consistency.

---

## ✅ Project Access
- **Local Dev**: `http://localhost:5173`
- **Frontend Status**: `tastystation.vercel.app`
- **Backend Status**: `tastystation-api.vercel.app` (depending on deployment)

---

Open `http://localhost:5173` in your browser.

---
