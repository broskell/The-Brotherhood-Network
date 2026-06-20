# The Brotherhood Network

A community-driven safety, emergency support, and mental wellbeing platform built for boys and men.

---

## 1. Problem Statement & Project Vision

In times of crisis, danger, or personal struggle, many men face these challenges in isolation. **The Brotherhood Network** is designed to dismantle this isolation by providing a high-integrity, real-time safety network. 

The platform enables users to:
* **Trigger Immediate Emergency SOS Alerts** to their trusted circle during danger.
* **Stream Realtime Location Coordinates** to active helpers.
* **Build a Vetted Trusted Circle** of brothers they trust implicitly.
* **Access a Private Evidence Vault** to securely document media, notes, and records.
* **Engage in Secure Realtime Chat** for mutual support and mental wellbeing.

---

## 2. Technology Stack

### Frontend (Client)
* **Framework:** React + Vite
* **Styling:** Tailwind CSS v4 (configured via imports, using premium dark red/black cinematic palette)
* **Animation:** Framer Motion (pulse alerts, spring cursors, physics transitions)
* **Navigation:** React Router DOM
* **API Client:** Axios
* **Icons:** Lucide React
* **WebSockets:** Socket.io-Client

### Backend (Server)
* **Runtime:** Node.js + Express.js
* **Database:** MongoDB + Mongoose (including compound unique indexing and `2dsphere` spatial indexing)
* **Realtime Server:** Socket.io (Namespaces: `/chat`, `/sos`)
* **Security Middlewares:** Helmet, CORS, HPP, XSS-Clean, Express-Rate-Limit, Cookie-Parser, Compression
* **Authentication:** JSON Web Tokens (JWT) featuring Refresh Token Rotation and Reuse Detection
* **Storage Handler:** Multer + Cloudinary

---

## 3. Directory File Tree

```
brotherhood-network/
├── client/
│   ├── src/
│   │   ├── assets/             # Icons, logos, and images
│   │   ├── components/         # Modular UI Components (Navbar, Hero, FeatureCards, FloatingSosButton)
│   │   ├── constants/          # Application configurations and constants
│   │   ├── context/            # React global context states
│   │   ├── hooks/              # Custom React hooks
│   │   ├── layouts/            # Global page templates
│   │   ├── pages/              # Primary route view components
│   │   ├── routes/             # App routing rules
│   │   ├── services/           # Axios API services (auth, sos, trusted)
│   │   ├── utils/              # Helper utilities
│   │   ├── App.jsx             # Main layout compositor
│   │   ├── index.css           # Tailwind v4 import, fonts, and dark custom variables
│   │   └── main.jsx            # React root mount
│   ├── index.html              # Core template and SEO metadata
│   ├── package.json            # Frontend dependency manifest
│   └── vite.config.js          # Tailwind v4 Vite compiler integrations
│
└── server/
    ├── config/
    │   ├── db.js               # Database connection wrapper
    │   └── cloudinary.js       # Cloudinary SDK client configuration
    ├── middleware/
    │   ├── auth.middleware.js  # JWT request validator
    │   ├── roles.middleware.js # RBAC roles checker
    │   ├── error.middleware.js # Global error handler
    │   ├── notFound.middleware.js # API 404 handler
    │   ├── rateLimit.middleware.js # Auth and API request limitations
    │   └── upload.middleware.js # Multer file upload filters
    ├── features/
    │   ├── auth/               # Register, Login, Logout, and Token Rotations
    │   │   ├── auth.controller.js
    │   │   ├── auth.routes.js
    │   │   ├── auth.service.js
    │   │   └── auth.validation.js
    │   ├── users/              # User Profile and Database Indexes
    │   │   └── user.model.js
    │   ├── sos/                # Emergency triggers, coordinates streams, resolutions
    │   │   ├── sos.controller.js
    │   │   ├── sos.model.js
    │   │   ├── sos.routes.js
    │   │   └── sos.service.js
    │   │   └── sos.validation.js
    │   └── trustedCircle/      # Relationship states (requests, approvals, syncs)
    │       ├── trustedCircle.controller.js
    │       ├── trustedCircle.model.js
    │       ├── trustedCircle.routes.js
    │       ├── trustedCircle.service.js
    │       └── trustedCircle.validation.js
    ├── sockets/
    │   └── socketManager.js    # Presence rooms and Namespace handlers (/chat, /sos)
    ├── .env.example            # Environment variables template
    ├── package.json            # Backend dependency manifest
    └── server.js               # Express application entry server
```

---

## 4. Environment Variables

### Backend Configuration (`server/.env`)
Create a `.env` file in the `server/` subdirectory:
```env
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_jwt_access_secret_key_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here
CLIENT_URL=http://localhost:5173
NODE_ENV=development

# Cloudinary configurations
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Frontend Configuration (`client/.env`)
Create a `.env` file in the `client/` subdirectory:
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

---

## 5. Local Setup & Execution

### Running the Frontend
```bash
cd client
npm install
npm run dev
```

### Running the Backend
```bash
cd server
npm install
npm run dev
```

---

## 6. Deployment Guide

Because Socket.io requires a persistent TCP server connection, **the frontend and backend must be deployed separately**:

1. **Frontend (Vercel):**
   * Change the project **Root Directory** from `./` to `client` inside Vercel's Project Settings.
   * Add the Environment Variables:
     * `VITE_API_URL` = `https://your-backend-url.onrender.com`
     * `VITE_SOCKET_URL` = `https://your-backend-url.onrender.com`

2. **Backend (Render / Railway / Fly.io):**
   * Link your repository and set the build command to `npm install` and start command to `npm start` in the `server/` directory.
   * Add the Environment Variables (`MONGODB_URI`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `CLOUDINARY_*`, `NODE_ENV=production`, `CLIENT_URL=https://your-frontend.vercel.app`).
