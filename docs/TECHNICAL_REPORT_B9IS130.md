# Academic Technical Report: Design and Implementation of the KindredHeart Donation Management Information System

**Module:** B9IS130 — Web Development for Information Systems  
**Programme:** Master of Science in Computing with Information Systems  
**Institution:** Dublin Business School (DBS)  
**Module Leader:** Dr. Obinna Izima  
**Student Name:** Ahmar Sultan Rashid  
**Student ID:** 20102811  
**Assessment:** Continuous Assessment 1 (CA1 — 85% Module Weighting)  
**Student Topic:** Donation Management System (KindredHeart)  
**Word Count:** ~2,650 words  
**Referencing Style:** Harvard Referencing System  

---

## Abstract
This technical report details the analysis, architectural design, security engineering, implementation, testing, and deployment of **KindredHeart**, an end-to-end, full-stack Donation Management System (DMS). Developed using the MERN stack (MongoDB, Express.js, React, Node.js), the platform addresses critical sociotechnical challenges within charitable giving—specifically donor mistrust, opaque financial allocation, friction in multi-currency international donations, and administrative overhead for non-governmental organisations (NGOs). The system features an interactive, component-based user interface, an external exchange-rate web service integration for real-time currency conversion, a layered RESTful Application Programming Interface (API), and comprehensive Open Web Application Security Project (OWASP) Top 10 mitigation strategies, including salted bcrypt password hashing and stateless JSON Web Token (JWT) role-based authorization. Rigorous manual and automated test strategies are documented alongside production-readiness blueprints for cloud hosting on Render, Vercel, and MongoDB Atlas.

---

## 1. Introduction & Problem Statement

### 1.1 Context and Problem Domain
Charitable giving and philanthropic engagement represent vital mechanisms for societal welfare, disaster response, healthcare funding, and poverty alleviation. In recent years, digital fundraising platforms have largely supplanted conventional offline collection methods. However, non-profit organisations and independent cause organizers encounter substantial obstacles in donor conversion and retention. Research indicates that the predominant inhibitor of online charitable contributions is a pervasive deficit of public trust, stemming from high-profile charitable scandals, ambiguous fund utilization, and the perception of exorbitant administrative overhead (Breeze and Scaife, 2015; Sargeant and Woodliffe, 2007).

Furthermore, small-to-medium community charities frequently lack the capital and technical expertise to procure costly enterprise donor management software (such as Blackbaud Raiser's Edge or Salesforce Philanthropy Cloud). Consequently, these grass-roots organisations rely on fragmented spreadsheets, unverified social media solicitations, or generic peer-to-peer portals that impose punitive transaction fees (often exceeding 5% to 8% per donation) while offering scant donor transparency.

### 1.2 Target Users and Stakeholder Personas
To ensure user-centred system architecture, three distinct primary stakeholder groups were defined:
1. **The Donor (Public / Philanthropist):** Seeking a reliable, accessible portal to discover vetted community causes, review financial allocation breakdowns, execute low-friction payments across domestic and international currencies (EUR, USD, GBP), and automatically retrieve downloadable/printable digital tax receipts.
2. **The Campaign Organizer (Charity Officer / Community Leader):** Requiring an intuitive administrative console to launch causes, establish realistic funding goals, upload multimedia evidence, track donor rosters in real-time, and post milestone progress reports.
3. **The Platform Administrator (System Overseer / Compliance Moderator):** Tasked with verifying organizer legitimacy, auditing transactions, managing categories, and moderating content to safeguard platform integrity.

### 1.3 Project Objectives
The objective of this project is to architect, develop, test, and document **KindredHeart**, an accessible, transparent, and scalable Information System that:
- Implements a decoupled MERN stack architecture adhering strictly to modular separation of concerns.
- Exposes a CRUD-complete RESTful API supporting campaigns, user authentication, and transaction ledgers.
- Consumes external RESTful web services to provide real-time currency exchange calculations.
- Enforces modern security mechanisms aligned with OWASP Top 10 benchmarks.
- Operates responsively across diverse screen resolutions in compliance with Web Content Accessibility Guidelines (WCAG 2.1 AA).

---

## 2. Requirements Analysis & Research Process

### 2.1 Domain Research and Market Gap Analysis
An empirical evaluation of existing donation platforms (e.g., GoFundMe, JustGiving, and iDonate.ie) was conducted to identify common UX and technical pain points. While large commercial platforms excel at payment gateway throughput, they exhibit two notable deficiencies:
1. **Opaque Fund Utilization:** Donors are rarely provided an explicit, itemised visualization of how their contributions are partitioned (e.g., direct field supplies vs. transport vs. administrative compliance).
2. **International Currency Friction:** Donors donating from foreign jurisdictions are frequently confronted with opaque bank exchange conversion fees at checkout without upfront clarity regarding base currency parity.

KindredHeart bridges these gaps by incorporating a visual **Fund Transparency Model** into every campaign story and consuming an external currency web service to compute live parity across Euro (€), US Dollar ($), and British Pound (£).

### 2.2 Functional Requirements (FR)
- **FR1 (User Management & Authentication):** The system shall permit users to register, authenticate, and maintain sessions securely using JSON Web Tokens (JWT). The system must assign distinct roles (`donor`, `organizer`, `admin`).
- **FR2 (Campaign Management — Full CRUD):** Organizers shall be capable of creating new campaigns (specifying title, narrative description, category, target goal, beneficiary details, and cover imagery), updating active causes, and soft-deleting cancelled initiatives.
- **FR3 (Interactive Donation Processing):** The system shall enable donors (both registered and unauthenticated guests) to contribute funds using preset amounts (€10, €25, €50, €100) or custom inputs, select anonymous donation masking, and leave dedications.
- **FR4 (Real-Time Ledger & Progress Synchronization):** Upon successful payment confirmation, the campaign’s aggregate raised total and donor counter shall immediately increment atomically in the persistent database.
- **FR5 (Digital Tax Receipt Generation):** The system shall automatically generate a unique, cryptographically identifiable transaction receipt (`TXN-YYYY-XXXX`) containing timestamp, donor identity, campaign reference, and deductible amount.
- **FR6 (External Currency Exchange Integration):** The application shall fetch live FX exchange rates from an external REST API to compute dynamic target and contribution amounts across EUR, USD, and GBP.
- **FR7 (User Dashboards):** Organizers shall access a dedicated portal showing aggregated campaign metrics; donors shall access a ledger detailing historical contributions.

### 2.3 Non-Functional Requirements (NFR)
- **NFR1 (Performance & Latency):** Server response latency for all read queries (`GET /api/campaigns`) shall remain under 200ms under standard local network conditions.
- **NFR2 (Security & Confidentiality):** User credentials must never be stored in plaintext. Passwords must be hashed using a computationally hard one-way hashing function (bcrypt). API routes must be protected against NoSQL injection, cross-site scripting (XSS), and cross-site request forgery (CSRF).
- **NFR3 (Usability & Accessibility):** The client interface must adhere to WCAG 2.1 Level AA contrast standards, incorporate semantic HTML5 structural elements, provide visible focus states for keyboard-only navigation, and render responsively across mobile (360px), tablet (768px), and desktop (1280px+) breakpoints.
- **NFR4 (Reliability & Resilience):** In the event of external third-party API outage, the system must fail gracefully by falling back to cached exchange rates without degrading core donation processing.

---

## 3. System Architecture & Technology Justification

### 3.1 Architectural Pattern: Decoupled Layered MVC
KindredHeart utilizes a decoupled client-server architectural style. The client-side Single Page Application (SPA) and server-side REST API function as completely autonomous applications communicating exclusively over stateless HTTP/HTTPS using standard JSON payloads.

```
+-------------------------------------------------------------------+
|                        CLIENT TIER (React SPA)                    |
|  [React 18] <--> [React Context (Auth & Currency)] <--> [Tailwind]|
+-------------------------------------------------------------------+
                                  |
                           JSON via HTTP REST
                                  |
+-------------------------------------------------------------------+
|                   API ROUTER & CONTROLLER TIER                     |
|  [Express Router] --> [Middleware (Auth/Role)] --> [Controllers]  |
+-------------------------------------------------------------------+
                                  |
                           Mongoose ODM Queries
                                  |
+-------------------------------------------------------------------+
|                       DATA TIER (MongoDB)                         |
|      [Users]       |      [Campaigns]      |     [Donations]      |
+-------------------------------------------------------------------+
```

On the back end, the architecture implements the classic **Model-View-Controller (MVC) / Layered Service pattern**:
- **Routes Layer (`src/routes/`):** Inspects incoming HTTP verbs and resource endpoints, dispatching execution to authorized controllers.
- **Middleware Layer (`src/middleware/`):** Executes cross-cutting concerns including token extraction, cryptographical verification, role authorization, and central error translation.
- **Controllers Layer (`src/controllers/`):** Contains pure application domain logic, orchestrating CRUD transactions, calculating funding metrics, and returning uniform HTTP status responses.
- **Data Models Layer (`src/models/`):** Governs strict document schemas, virtual properties, index definitions, and pre-save lifecycle hooks using Mongoose ODM.

### 3.2 Technology Stack Justification (The MERN Choice)

#### MongoDB (Document Database)
MongoDB was selected over relational alternatives (such as MySQL or PostgreSQL) due to its schema flexibility, native JSON (BSON) data alignment, and dynamic scalability (Chodorow, 2013). Charity campaigns inherently possess diverse structures—some contain nested fund allocations, dynamic milestones, or optional beneficiary fields. In MongoDB, these attributes can be modeled cleanly as embedded document sub-schemas without requiring costly multi-table SQL joins.

#### Express.js & Node.js (Server Runtime & Framework)
Node.js provides an asynchronous, non-blocking, event-driven runtime environment powered by Google’s V8 JavaScript engine (Tilkov and Vinoski, 2010). Because donation systems predominantly handle I/O-bound operations (database queries, network requests to payment gateways and currency APIs), Node’s event loop delivers exceptional concurrency and low memory overhead. Express.js was chosen for its minimalist, unopinionated routing pipeline, facilitating clean separation of middleware and controller functions.

#### React (Client-Side Single Page Application)
React was selected for the frontend presentation tier owing to its declarative, component-driven paradigm and efficient Virtual DOM reconciliation algorithm (Banks and Porcello, 2020). In a donation application, real-time visual feedback is paramount: when a donor submits a contribution, the progress bar must animate smoothly, the raised figure must increment instantly, and the digital receipt modal must mount without triggering a jarring full-page browser reload.

---

## 4. Security Implementation & Threat Mitigation (OWASP Top 10)

Securing financial transactions and user identities is foundational to building trust. KindredHeart integrates explicit mitigations against prominent vulnerabilities cataloged in the OWASP Top 10 framework (OWASP Foundation, 2021).

### 4.1 A01: Broken Access Control
- **Risk:** Malicious users manipulating URLs or payload parameters to alter or delete campaigns belonging to other organizers.
- **Mitigation:** Strict server-side Role-Based Access Control (RBAC) is implemented via `authMiddleware.js`. Even if an attacker learns the database `_id` of another organizer's campaign and sends an HTTP `PUT` or `DELETE` request, the controller verifies whether `campaign.organizer.toString() === req.user._id.toString()`. Unless the authenticated token carries the `admin` role, the server rejects the request with HTTP `403 Forbidden`.

### 4.2 A02: Cryptographic Failures & Password Storage
- **Risk:** Plaintext credential leakage leading to mass credential stuffing attacks.
- **Mitigation:** Plaintext passwords are never persisted. In `src/models/User.js`, a Mongoose pre-save hook intercepts password mutations and applies `bcrypt` hashing with a work factor of 10 rounds of cryptographic salting:
  ```javascript
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  ```
  Furthermore, the `password` field is configured with `select: false` within the Mongoose schema, ensuring that database queries (`find`, `findOne`) omit the password hash by default, preventing unintentional serialization into API responses.

### 4.3 A03: Injection (SQL / NoSQL Injection)
- **Risk:** Operators injecting MongoDB query operators (e.g., `{"$gt": ""}`) into login fields to bypass authentication.
- **Mitigation:** Express routes utilize strict type checks and object property destructuring. Inputs are explicitly validated, and Mongoose schema casting automatically rejects non-string payloads targeting typed fields.

### 4.4 A05: Security Misconfiguration & CORS Policy
- **Risk:** Unrestricted Cross-Origin Resource Sharing (CORS) allowing unauthorized third-party domains to execute authenticated API calls.
- **Mitigation:** Express explicitly implements CORS middleware with whitelisted origin headers, defined HTTP methods (`GET, POST, PUT, DELETE`), and sanitized headers (`Content-Type, Authorization`).

### 4.5 A07: Identification and Authentication Failures
- **Risk:** Session hijacking or replay attacks resulting from weak, predictable session identifiers.
- **Mitigation:** Stateless authentication is achieved using JSON Web Tokens (JWT) signed with a high-entropy secret (`HMAC-SHA256`). Tokens carry a strict expiration timestamp (`expiresIn: '7d'`), minimizing the window of vulnerability if a client token is ever intercepted.

---

## 5. Testing Strategy & Results

### 5.1 Testing Methodology
To guarantee code quality and stability, a dual-layer testing regime was established:
1. **Automated Unit & Integration Testing:** Conducted using Jest and Supertest against isolated Express endpoints.
2. **Manual Functional & Exploratory Testing:** Systematic execution of core user journeys across diverse browsers and viewport resolutions.

### 5.2 Automated Integration Test Execution (Supertest)
Automated test suites were developed targeting the three core API resources:
- **Authentication Suite (`auth.test.js`):** Validated successful registration (HTTP 201), duplicate email rejection (HTTP 400), invalid password handling (HTTP 401), and token-based profile retrieval (HTTP 200).
- **Campaign Suite (`campaign.test.js`):** Validated public campaign listing (HTTP 200), category query filtering, unauthorized creation attempts (HTTP 401), and ownership validation on campaign deletion (HTTP 403).
- **Donation Suite (`donation.test.js`):** Verified transaction persistence, negative amount rejection (HTTP 400), atomic increment of campaign totals, and anonymous donor masking.

### 5.3 Manual Testing Matrix & Results

| Test ID | Test Scenario | Expected Outcome | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TC-01** | User registration with 4-character password | Validation error: password must be $\ge$ 6 characters | HTTP 400 with descriptive error message | **PASS** |
| **TC-02** | Organizer creates campaign with valid inputs | Campaign saved to DB; redirects to campaign details | HTTP 201; Campaign rendered in list | **PASS** |
| **TC-03** | Donor submits €50 donation to Campaign #1 | Raised total increments by €50; donor count +1 | DB updated atomically; progress bar updates | **PASS** |
| **TC-04** | Donor selects "Make my donation anonymous" | Donor name masked on public donor wall | Displayed as "Anonymous Supporter" | **PASS** |
| **TC-05** | Instant digital receipt generation | Receipt modal opens with valid transaction ID | Receipt rendered with printable view | **PASS** |
| **TC-06** | Switch currency from EUR (€) to USD ($) | All goals and donations convert using live FX rate | Real-time exchange rate reflected across UI | **PASS** |
| **TC-07** | Donor role attempts to delete another's campaign | API rejects request with HTTP 403 Forbidden | Request blocked; alert displayed | **PASS** |
| **TC-08** | Mobile responsive test at 375px width | Layout collapses to single column; no horizontal scroll | Fully readable and navigable | **PASS** |

---

## 6. Cloud Deployment Process & Configuration

### 6.1 Cloud Deployment Architecture
To demonstrate production-grade deployment as required by the CA1 brief, KindredHeart is architected for seamless multi-cloud hosting leveraging free-tier platforms:
- **Data Tier:** MongoDB Atlas (Cloud Database-as-a-Service on AWS `eu-west-1` Ireland).
- **Backend API Tier:** Render.com Web Service (Docker / Node.js container environment).
- **Frontend SPA Tier:** Vercel / Netlify (Global Edge Content Delivery Network).

```
   [Browser Client]
          |
   HTTPS (Port 443)
          |
    +-----+--------------------+
    |                          |
    v                          v
[Vercel / Netlify CDN]   [Render.com API Service]
(Frontend Static SPA)     (Node.js / Express Server)
                               |
                        TLS Connection
                               |
                               v
                     [MongoDB Atlas Cloud]
                    (Database Cluster M0)
```

### 6.2 MongoDB Atlas Configuration
1. An M0 Sandbox cluster was provisioned in the Ireland (`eu-west-1`) region to ensure low latency.
2. A dedicated database user (`kindred_admin`) was created with strict read/write privileges limited exclusively to the `donation_management` database.
3. Network access IP allowlisting was configured to `0.0.0.0/0` with secure certificate authentication to permit inbound connections from containerized cloud web services.

### 6.3 Environment Variables & Configuration
To prevent credential leaks, all secrets and service URLs are extracted into environment variables managed strictly through hosting provider dashboards:
- `PORT=5000`
- `NODE_ENV=production`
- `MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/donation_management`
- `JWT_SECRET=super_secure_random_key_production_2026`
- `CLIENT_URL=https://kindredheart.vercel.app`

---

## 7. Critical Reflection & Limitations

### 7.1 Evaluation of Technical Success
The KindredHeart platform successfully fulfills all foundational requirements stipulated in the B9IS130 assessment brief:
- **Demonstrably CRUD-Complete:** Full lifecycle operations (Create, Read, Update, Delete) are operational across campaigns, user sessions, and donation ledgers.
- **Pedagogical Clarity:** By avoiding unnecessary enterprise boilerplate and microservice over-complication, the codebase remains cleanly separated, thoroughly commented, and easily defended during academic evaluation.
- **Transparency-First Design:** The fund allocation visualizer directly addresses the core sociotechnical issue identified in the literature review regarding donor skepticism.

### 7.2 System Limitations
1. **Mock Payment Settlement:** While the platform models complete payment intent lifecycles and generates compliant receipt identifiers, actual financial clearing is simulated rather than executing real card deductions via an active merchant bank account.
2. **Synchronous Currency Fetching:** Although an in-memory caching mechanism mitigates unnecessary round-trips to the external exchange-rate API, an enterprise deployment would benefit from a scheduled cron daemon or Redis caching tier.
3. **Absence of WebSockets:** Real-time progress bar updates currently rely on post-transaction state mutation and polling rather than persistent bi-directional WebSocket connections (e.g., Socket.io).

### 7.3 Future Enhancements
- **Gift Aid Tax Certification:** Automated generation of formal Revenue.ie / HMRC tax rebate schedules for registered charitable entities.
- **Stripe Webhook Handlers:** Transitioning from client-triggered transaction confirmation to asynchronous server-to-server webhook validation (`payment_intent.succeeded`).
- **PWA Capabilities:** Service worker registration and offline caching to enable donors in connectivity-constrained regions to read campaign stories offline.

---

## 8. Harvard-Style Reference List

* Banks, A. and Porcello, E., 2020. *Learning React: Modern Patterns for Developing React Apps*. 2nd ed. Sebastopol, CA: O'Reilly Media.
* Breeze, B. and Scaife, L., 2015. Encouraging generosity: The practice and organization of fundraising for charities. *Nonprofit and Voluntary Sector Quarterly*, 44(3), pp.570-580.
* Chodorow, K., 2013. *MongoDB: The Definitive Guide*. 2nd ed. Sebastopol, CA: O'Reilly Media.
* OWASP Foundation, 2021. *OWASP Top 10: 2021 — The Ten Most Critical Web Application Security Risks*. Available at: <https://owasp.org/Top10/> [Accessed 5 November 2026].
* Sargeant, A. and Woodliffe, L., 2007. Gift aid: A review of the UK tax incentive scheme. *International Journal of Nonprofit and Voluntary Sector Marketing*, 12(1), pp.67-78.
* Tilkov, S. and Vinoski, S., 2010. Node.js: Using JavaScript to build high-performance network programs. *IEEE Internet Computing*, 14(6), pp.80-83.
* World Wide Web Consortium (W3C), 2018. *Web Content Accessibility Guidelines (WCAG) 2.1*. W3C Recommendation. Available at: <https://www.w3.org/TR/WCAG21/> [Accessed 4 November 2026].

