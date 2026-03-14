# Tasty Station POS: Senior/Lead Engineer Interview Q&A

This document contains a comprehensive list of potential interview questions based on the architecture, challenges, and solutions implemented in the Tasty Station POS project. It is broken down into Backend, Frontend, Architecture, and Behavioral sections.

---

## 🏗️ Architecture & System Design Questions

### Q1: "Walk me through the architecture of the POS system you built."
**Answer:**
"The Tasty Station POS is a decoupled, modern web application.
*   **The Backend** is a Node.js/Express REST API serving as the core business logic layer. Data is persisted in a MongoDB cluster. We use Mongoose for schema modeling and `express-validator` for a strict input validation layer.
*   **The Frontend** is a React SPA built with Vite and Tailwind CSS. State is managed globally via Zustand, specifically chunking the Auth and Cart states.
*   **Real-Time Layer:** Because it's a POS, immediate communication between cashiers and the kitchen is critical. I integrated a Socket.io layer running alongside the Express server, natively pushing events like `newOrder` down to the React clients via TCP WebSockets instead of relying on inefficient HTTP polling.
*   **Resilience:** I configured the frontend as a Progressive Web App (PWA) using Service Workers, ensuring that even if the restaurant loses internet, the local POS interface remains functional via cached assets."

### Q2: "How did you ensure data integrity during complex checkout flows?"
**Answer:**
"This was a major focus. Creating an order isn't just one database insert; it involves creating the order document, updating inventory, and modifying the client's total spent history. I used **MongoDB Session Transactions** (`session.withTransaction`). This wrapped these distinct operations into a single Atomic block. If the server crashed mid-way, or if the client update failed, the entire transaction rolled back automatically. This guaranteed that the financial and loyalty data never fell out of sync, satisfying the ACID properties essential for a billing system."

### Q3: "If this restaurant chain expands to 100 locations, where will the current architecture bottleneck, and how would you fix it?"
**Answer:**
"As a Lead, I anticipate three main bottlenecks with scale:
1.  **Database Read Latency:** As the `orders` collection hits millions of rows, querying 'Recent Pending Orders' for kitchen displays will slow down. I proactively added **Compound Indexing** on `{status: 1, createdAt: -1}` to keep this query at `O(log N)` complexity. For true multi-tenant scale, we'd eventually need to shard the database by `restaurantId`.
2.  **Socket Connection Limits:** A single Node.js instance can only handle about 10k concurrent WebSocket connections. To scale, I would introduce **Redis Pub/Sub** behind a load balancer (like NGINX), allowing multiple stateless Node instances to broadcast Socket events across the cluster.
3.  **Monolithic API:** Currently, it's a monolith. With 100 locations, I would extract the core 'Billing/Payment' logic into a separate microservice to isolate financial transactions from menu browsing traffic."

---

## 🛡️ Backend & Security Questions

### Q4: "How did you handle user authentication and authorization?"
**Answer:**
"Initially, JWTs were stored in `localStorage`, which is a critical XSS vulnerability. I re-architected the auth flow to be truly stateless and secure by utilizing **HttpOnly, Secure Cookies**. 
When a user logs in, the Express server signs the JWT and attaches it to `res.cookie` with `sameSite: 'strict'`. This ensures the token is invisible to any malicious JavaScript injected into the frontend. The backend verifies this cookie via custom middleware before granting access to protected routes."

### Q5: "What steps did you take to protect your public APIs from abuse?"
**Answer:**
"Public routes, especially `/login` and `/register`, are susceptible to brute-force attacks and volumetric DoS attacks. I implemented `express-rate-limit` at the application level. I configured an `apiLimiter` that tracks requests by IP address, capping them at 100 requests per 15-minute window. Any request exceeding this limit receives a `429 Too Many Requests` response. For a production scale, I would back this rate-limiter with an in-memory Redis store so the limits apply horizontally across all load-balanced Node servers."

### Q6: "How did you standardize error handling across the backend?"
**Answer:**
"In large codebases, fragmented `try/catch` blocks lead to inconsistent API responses. I implemented a centralized error-handling architecture. I created a custom `ApiError` class extending the native JavaScript `Error` object to uniformly attach HTTP status codes. Then, I wrote a global error-handling middleware (`error.middleware.js`). All controllers pass their errors to `next()`, and the global middleware catches them, strips the stack trace in production for security, and returns a predictable, standardized JSON payload to the frontend."

---

## ⚡ Frontend & Performance Questions

### Q7: "The POS dashboard has a lot of data. How did you optimize React's rendering performance?"
**Answer:**
"Performance in the browser thread is vital for cashiers. I caught several rendering bottlenecks:
1.  **Code Splitting:** The initial JS bundle was massive because it included complex Admin charts and staff management tables. I used `React.lazy()` and `Suspense` to lazily load administrative routes, drastically reducing the Time-to-Interactive for the core checkout screen.
2.  **Re-render Pruning:** The menu grid was re-rendering 50+ DOM nodes every time a single item was added to the cart. I wrapped the `MenuItemCard` and `OrderTableRow` components in `React.memo()`. This tells React to skip the Virtual DOM diffing process if the component's props haven't changed, saving heavy CPU cycles."

### Q8: "Why did you choose Zustand over Redux or Context API?"
**Answer:**
"Context API inherently triggers a re-render for every component consuming the context whenever the state changes, which is terrible for performance in a busy POS app. Redux solves this but introduces massive boilerplate. 
I chose **Zustand** because it offers the performance of Redux (selective state subscribing) without the boilerplate. Furthermore, Zustand's built-in `persist` middleware made it trivial to save the user's Auth state and the current Cart to `localStorage` (for non-sensitive data), ensuring the cashier doesn't lose an active $200 order if they accidentally refresh the browser."

### Q9: "What strategies did you use to make the app resilient to network failures?"
**Answer:**
"A POS system cannot go down during a lunch rush just because the ISP resets the router.
1.  I moved away from frail polling to robust WebSockets, which have built-in reconnection logic.
2.  I configured a **Progressive Web App (PWA)** using `vite-plugin-pwa` Service Workers. This intercepts network requests and aggressively caches the 'App Shell' (HTML, CSS, JS, and Images) locally. If the network drops, the UI loads instantly from cache.
3.  *(Future enhancement)*: I am planning to implement an `IndexedDB` sync queue, where offline orders are saved locally and automatically pushed to the server via the Background Sync API once connectivity is restored."

---

## 🤝 Behavioral & Leadership Questions

### Q10: "Tell me about a time you found a major flaw in an existing system and how you addressed it."
**Answer:**
"During my architectural review of the POS codebase, I noticed that multi-document operations (like saving an order and updating stats) were being executed sequentially without transaction logic. I realized that under heavy load, a server restart would corrupt our financial data—a massive business risk. 
Instead of just patching the UI bug, I took a step back, documented the risk, and implemented MongoDB session transactions across the controllers. I then took the time to write a unit testing suite (`useOrderStore.test.js`) using Vitest to enforce the cart calculation logic, ensuring no future developer could accidentally break the billing integrity."

### Q11: "How do you balance shipping fast versus writing 'perfect' code?"
**Answer:**
"I adhere to the 'make it work, make it right, make it fast' philosophy. In the early phases of this POS, we needed to prove the core loop (taking an order, displaying it in the kitchen). We utilized basic REST calls and `localStorage` auth to ship quickly. 
Once the business logic was validated, I shifted to my 'Lead' mindset. I didn't rewrite the whole app; I targeted specific, high-ROI technical debt. I migrated to HttpOnly cookies for security, added MongoDB transactions for data safety, and sprinkled in `React.memo()` for performance. We shipped fast, but then we fortified the architecture before it collapsed under scale."
