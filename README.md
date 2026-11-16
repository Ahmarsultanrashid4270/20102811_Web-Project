# KindredHeart - Donation Management System

Student Name: Ahmar Sultan Rashid
Student ID: 20102811
Module: B9IS130 - Web Development for Information Systems
College: Dublin Business School (DBS)
Module Leader: Dr. Obinna Izima

---

## 1. About My Project

KindredHeart is a full-stack web application for donation and charity management. I built this project using the MERN Stack (MongoDB, Express, React, and Node.js).

The goal of this website is to make donating easy, transparent, and trustworthy. People can see exactly how much money has been raised for a cause, donate using their preferred currency, and immediately get a digital receipt.

---

## 2. Key Features

- User Accounts: Users can register as a Donor (to support causes) or an Organizer (to start a fundraiser).
- Explore Campaigns: Anyone can search campaigns by name or filter by categories like Healthcare, Education, and Disaster Relief.
- Live Progress Bar: Each campaign shows how much money has been raised and how many donors have contributed.
- Instant Digital Receipt: After donating, a receipt is shown on screen with a unique transaction number and a print button.
- Currency Converter: Real-time exchange rates (EUR, USD, GBP) fetched from an external API.
- User Dashboard:
  - Donors can see their past donation history.
  - Organizers can see and manage their created campaigns.

---

## 3. Technologies Used

- Frontend: React.js, Tailwind CSS, Vite
- Backend: Node.js, Express.js
- Database: MongoDB and Mongoose
- Authentication: JSON Web Tokens (JWT) and bcryptjs for password security
- External API: Live currency exchange rates from open.er-api.com

---

## 4. How to Run the Project Locally

### Step 1: Start the Backend
Open terminal and run:
```bash
cd backend
npm install
npm run seed
npm start
```
The backend server runs on http://localhost:5000.

### Step 2: Start the Frontend
Open another terminal and run:
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173 in your browser.

---

## 5. Test Accounts for Demo

You can use these ready-made test accounts to test the project:

| Role | Email | Password |
| :--- | :--- | :--- |
| Admin | admin@kindred.org | password123 |
| Organizer | organizer@redcross.org | password123 |
| Donor | donor@student.dbs.ie | password123 |

Note: You can also use the 1-click fill buttons on the login page during testing.
