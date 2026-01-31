# Online Prescription Platform

A MERN stack application for online doctor consultations and prescriptions.

## Features

- Doctor and Patient authentication with profile pictures
- Patient can view doctors and book consultations
- Multi-step consultation form
- Doctor can view consultations and create/edit prescriptions
- PDF generation for prescriptions
- QR code payment simulation

## Tech Stack

- Backend: Node.js, Express, MongoDB, JWT
- Frontend: React, Material-UI, Axios
- PDF: PDFKit
- QR: QRCode

## Setup

1. Clone the repository
2. Backend: `cd backend && npm install && npm start`
3. Frontend: `cd frontend && npm install && npm start`
4. Ensure MongoDB is running

## API Routes

### Auth
- POST /api/auth/signup - Sign up
- POST /api/auth/signin - Sign in

### Doctors
- GET /api/doctors - Get all doctors
- GET /api/doctors/profile - Get doctor profile
- GET /api/doctors/consultations - Get doctor's consultations
- POST /api/doctors/prescription - Create prescription
- GET /api/doctors/prescriptions - Get prescriptions

### Patients
- GET /api/patients/profile - Get patient profile
- GET /api/patients/consultations - Get patient's consultations
- GET /api/patients/prescriptions - Get patient's prescriptions

### Consultations
- POST /api/consultations - Create consultation
- GET /api/consultations/payment-qr/:id - Get payment QR

### Prescriptions
- POST /api/prescriptions - Create prescription
- PUT /api/prescriptions/:id - Update prescription
- POST /api/prescriptions/send/:id - Send prescription

## URLs

- Doctor Auth: /doctor/auth
- Patient Auth: /patient/auth

## Database Dump

Export MongoDB database as JSON or use mongodump.

## Deployment

### Prerequisites
- MongoDB Atlas account (free tier)
- GitHub account
- Netlify account (free)
- Render account (free for backend)

### 1. Database Setup (MongoDB Atlas)
1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Allow network access from anywhere.
3. Create a database user.
4. Get the connection string and update `backend/.env`:
   ```
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/mern-prescription?retryWrites=true&w=majority
   JWT_SECRET=your_secure_jwt_secret_here
   PORT=5000
   ```

### 2. Backend Deployment (Render)
1. Push code to GitHub.
2. Go to [Render](https://render.com) and create a Web Service.
3. Connect GitHub repo.
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add environment variables: `MONGO_URI`, `JWT_SECRET`, `PORT`
7. Deploy. Note the backend URL (e.g., `https://your-app.onrender.com`).

### 3. Frontend Deployment (Netlify)
1. Update API URLs in `frontend/src/components/` to the Render backend URL.
2. Run `npm run build` in `frontend` directory.
3. Go to [Netlify](https://www.netlify.com) and deploy the `build` folder manually.
4. Note the frontend URL (e.g., `https://your-site.netlify.app`).

### 4. Testing
- Test sign-up, consultations, prescriptions, PDF download.
- Ensure images and QR codes work.

### Submission
- Hosting Link: Netlify URL
- Admin Credentials: Doctor account (e.g., email: admin@doctor.com)
- User Credentials: Patient account (e.g., email: user@patient.com)
- Server Credentials: MongoDB Atlas details
- Screen Recording: Google Drive link
- Code: GitHub or Google Drive
- DB Dump: MongoDB export

## Hosting

Host on Netlify (frontend) and Heroku/Render (backend), or any free hosting.