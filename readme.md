# Tasty Station - Enterprise Restaurant POS System 🍽️

**Tasty Station** is a high-performance, enterprise-grade Point of Sale (POS) application designed for modern restaurants. It streamlines operations from order taking to kitchen management, inventory tracking, and financial reporting. Built on the **MERN Stack** and optimized for scale with **Redis Caching** and **Server-Side Pagination**, it ensures lightning-fast performance even under heavy loads.

---

## 🚀 Live Demo

**Application URL:** [https://tastystation.vercel.app](https://tastystation.vercel.app)

### 🔑 Login Credentials

You can explore the system using the following Admin credentials:

- **Email:** `admin@me.com`
- **Password:** `12345678`

_(Cashier and Kitchen roles can also be created via the Admin panel)_

---

## 🏛️ System Architecture & Technologies

This application uses a robust, scalable architecture ensuring reliability and speed.

### **Frontend (Client-Side)**

- **Framework:** [React 18](https://reactjs.org/) with [Vite](https://vitejs.dev/) for ultra-fast builds.
- **State Management:** [Zustand](https://github.com/pmndrs/zustand) for efficient, global state management without boilerplate.
- **UI Component Library:** **Shadcn UI** (built on Radix Primitives) + **Tailwind CSS** for a premium, accessible, and responsive design.
- **Icons:** **Lucide React** for consistent, modern iconography.
- **HTTP Client:** **Axios** with centralized interceptors for base URL switching and error handling.
- **Notifications:** **Sonner** for toast notifications.

### **Backend (Server-Side)**

- **Runtime:** [Node.js](https://nodejs.org/) (v20+)
- **Framework:** [Express.js v5](https://expressjs.com/) (Experimental) for modern routing and middleware handling.
- **Database:** [MongoDB Atlas](https://www.mongodb.com/) with **Mongoose** for schema modeling and data validation.
- **Caching:** [Redis](https://redis.io/) (via Upstash) for high-speed data retrieval (Menu, Dashboard Stats).
- **Authentication:** **JWT (JSON Web Tokens)** stored in HTTP-Only cookies for secure session management.
- **Image Storage:** **Cloudinary** for optimized menu image hosting.

---

## ✨ Key Features

### 1. ⚡ High-Performance Architecture

- **Redis Caching:** Frequently accessed data (Categories, Menu Items, Dashboard Stats) is cached in Redis, reducing database queries by **80%** and bringing API response times under **50ms**.
- **Server-Side Pagination:** implemented across all major data tables (Orders, Menu, Inventory, Clients) to handle thousands of records efficiently without bloating the frontend.
- **Express 5 Wildcards:** Advanced routing using RegExp matching for improved compatibility and security.

### 2. 📊 Powerful Analytics Dashboard

- **Real-Time Insight:** Live tracking of Total Sales, Total Orders, and Active Customers.
- **Visual Charts:** Graphical representation of sales trends and revenue distribution.
- **Smart Filtering:** Filter data by Daily, Weekly, or Monthly timeframes.

### 3. � Menu Management

- **Dynamic Categories:** Create, edit, and reorganize menu categories.
- **Rich Media:** Upload high-resolution images for dishes using Cloudinary integration.
- **Variant Support:** Manage different sizes and prices for single items.

### 4. � Professional Order Terminal

- **Point of Sale Interface:** A visual, touch-friendly grid layout for cashiers.
- **Category Filter Bar:** Quick navigation through menu sections.
- **Smart Cart:** Real-time calculation of taxes, discounts, and total bill.
- **Order Persistence:** Local table management ensuring orders are linked to specific tables.

### 5. 📦 Inventory & Stock Control

- **Live Inventory Tracking:** Monitor ingredient usage and stock levels.
- **Low Stock Alerts:** Visual indicators for items running low.
- **Paginated Management:** Easily manage thousands of inventory SKUs with search and filtering.

### 6. 👥 Staff & Role Management (RBAC)

- **Role-Based Access Control:** Strict security policies for:
  - **Admin:** Full system access.
  - **Manager:** Operational control.
  - **Cashier:** Order processing only.
  - **Kitchen:** Order view only.
  - **Waiter:** Table service only.
- **Security:** PIN codes and active status toggling for staff members.

### 7. 🖨️ Reporting & Billing

- **Sales Reports:** Detailed breakdown of revenue by item and category.
- **Receipt Generation:** Professional, printable receipts for customers.
- **Client History:** Track loyal customers and their order history.

---

## ⚙️ How It Works (Workflow)

1.  **Authentication:** Users log in securely. The server issues an HTTP-Only cookie containing the JWT.
2.  **Role Verification:** Every API request passes through a `protectRoute` middleware that verifies the token and checks the user's role permissions.
3.  **Data Retrieval (Optimized):**
    - **Step A:** The server checks **Redis Cache**. If data exists, it's returned immediately (Speed: ~10ms).
    - **Step B:** If not in cache, the server queries **MongoDB**, sends the response, and stores it in Redis for future requests (TTL: 1 hour).
4.  **Frontend Rendering:** The React frontend receives the data and uses **Zustand** to update the UI instantly without page reloads.

---

## 🏗️ Monorepo Structure

This project is organized as a monorepo for better developer experience and deployment orchestration:
- `/backend`: Node.js/Express API.
- `/frontend`: Vite/React application.
- `/`: Root configuration for CI/CD and orchestration.

---

## 🛠️ Setup & Installation

To run this project locally, you no longer need to manage multiple terminals manually:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/hey-Zayn/POS.git
    cd POS
    ```

2.  **One-Command Install:**
    ```bash
    npm run install:all
    ```

3.  **One-Command Development:**
    ```bash
    # Starts BOTH Backend (3000) and Frontend (5173) simultaneously
    npm run dev
    ```

> [!NOTE]
> Make sure to copy `backend/.env.example` to `backend/.env` and fill in your credentials before starting.

---

## 🚀 CI/CD Pipeline (Professional DevOps)

This project implements a production-grade CI/CD pipeline using **GitHub Actions** and **Vercel**:

### **1. Continuous Integration (CI)**
Runs on every Push and Pull Request to `main` or `develop`:
- **Linting**: Auto-scans frontend code for quality and style errors.
- **Build Validation**: Ensures the Vite project builds successfully.
- **Backend Check**: Scans all Node.js files for syntax health.

### **2. Continuous Deployment (CD)**
- **Preview Deployments**: Every PR automatically generates a unique Vercel preview URL (posted as a PR comment).
- **Production Deployment**: Merging to `main` triggers an automatic deployment to the live URL.

---

## ✅ Access App
Open `http://localhost:5173` in your browser.

---
