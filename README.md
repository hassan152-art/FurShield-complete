# FurShield

**"Every Paw/Wing Deserves a Shield of Love."**

A pet-care platform connecting Pet Owners, Veterinarians, Animal Shelters, and Admins — pet profiles, health records, vet appointments, adoption listings, a product shop, care guides, notifications and reviews.

## Scope of this build

**Fully implemented and working:**
- Complete backend: 20 Mongoose models, JWT auth with bcrypt, role-based authorization middleware that never trusts client-sent roles, and REST controllers/routes for auth, pets, appointments, vets (with a rule-based recommendation endpoint), adoption + interest workflow, shelter care logs, products/cart/checkout (no payment gateway — request-only orders, as required), care articles/videos/FAQs, health records, medical documents, pet insurance, notifications, reviews, contact messages, an AI assistant endpoint that calls the Anthropic API server-side only, and an admin analytics/moderation API.
- Centralized error handling, consistent `{ success, message, data }` responses, security middleware (Helmet, CORS, rate limiting, Mongo sanitization), a seed script with 4 demo accounts and sample data.
- Frontend: React + Vite + Tailwind with the FurShield color tokens, React Router with protected, role-based routes, an Axios service layer + Auth context with JWT persistence, a working landing page (hero, stats, services, CTA) with Framer Motion scroll animations, working Login/Register (role-aware) forms, a functional Pets CRUD dashboard wired to the real API, public Vets/Adoption/Products/About/Contact pages that fetch real data, a shopping cart page (update/remove/checkout), owner order history, a per-pet Health page (vaccination/treatment timeline, medical document uploads, insurance policies), veterinarian treatment logging tied to appointments, shelter care-log tracking per adoption listing, a floating AI pet-care chat widget, and a live Google Maps embed on the Contact page.

**Scaffolded but intentionally minimal** (structure and one working example are in place; extend following the same pattern):
- The 3D hero scene (Three.js/R3F) and the full admin content/product management screens beyond basic CRUD. The backend endpoints for all of these already exist — what's left is mostly frontend polish following the same component patterns already used elsewhere.

Building out the remaining screens is a natural next step once you've confirmed the foundation runs correctly in your environment.

## Tech Stack

- **Frontend:** React, Vite, React Router, Axios, Tailwind CSS, Framer Motion, Lucide icons, React Hot Toast
- **Backend:** Node.js, Express, MongoDB Atlas, Mongoose, JWT, bcryptjs, Helmet, CORS, express-rate-limit, Morgan, Multer (ready for uploads), Nodemailer (ready for email)

## Project Structure

```
furshield/
├── server/          Express API (src/config, controllers, models, routes, middleware, utils)
└── client/          React app (src/pages, components, layouts, context, services)
```

## Installation

### 1. Backend

```bash
cd server
npm install
cp .env.example .env
# Edit .env: set MONGO_URI to your MongoDB Atlas connection string, and JWT_SECRET
npm run seed   # creates demo accounts + sample data
npm run dev    # starts on http://localhost:5000
```

### 2. Frontend

```bash
cd client
npm install
cp .env.example .env   # VITE_API_URL=http://localhost:5000/api
npm run dev             # starts on http://localhost:5173
```

## MongoDB Atlas

This app requires MongoDB Atlas (no local Mongo dependency). Create a free cluster at https://www.mongodb.com/cloud/atlas, get your `mongodb+srv://...` connection string, and put it in `server/.env` as `MONGO_URI`. Never commit `.env`.

## Environment Variables

See `server/.env.example` for the full list (Mongo, JWT, Cloudinary, SMTP, AI key). AI and Cloudinary keys are optional — features that depend on them return a clear "not configured" message rather than crashing.

## Demo Accounts

After running `npm run seed` (password is `FurShield123!` unless you set `SEED_DEMO_PASSWORD`):

| Role | Email |
|---|---|
| Admin | admin@furshield.com |
| Pet Owner | owner@furshield.com |
| Veterinarian | vet@furshield.com |
| Shelter | shelter@furshield.com |

## API Overview

```
/api/auth              register, login, me, forgot/reset password
/api/pets               owner pet CRUD
/api/appointments        book/list/update appointments (double-booking prevented), vet treatment logging (/:id/log)
/api/vets               list, get, /recommend (condition-based), availability
/api/adoptions           listings CRUD, interest submission + shelter review workflow
/api/shelter             care logs, shelter's own listings
/api/products            browse/search/filter
/api/cart                add/update/remove items
/api/orders              checkout (request-only, no payment) + order history
/api/care                articles, videos, FAQs
/api/health-records       vaccination/treatment timeline per pet (owner + treating vet)
/api/medical-documents    vet certificates, X-rays, lab report uploads per pet
/api/insurance            pet insurance policies and claim documents
/api/notifications        list, mark read
/api/reviews              add/list/edit/delete (1 review per user per target)
/api/contact              contact form submissions
/api/banners              homepage hero/promo banners (admin-managed)
/api/uploads              image/video/document uploads, saved to server/src/uploads and served statically
/api/ai                  AI assistant (server-side key, never exposed to client)
/api/admin                analytics, user/product/order management, review moderation
```

## Appointment Reminders

The server runs a lightweight in-process scheduler (`services/reminderService.js`, started from
`server.js`) that checks every minute for **confirmed** appointments starting in about 30 minutes
and creates a Notification for the pet owner (visible on the Notifications page and navbar bell).
Each appointment is only reminded once (`reminderSent` flag on the `Appointment` document). This
runs as long as the Node process is running — no external cron service or extra dependency needed.

## File Uploads

Pet photos, product photos, adoption listing photos/videos, and medical/insurance documents are
uploaded straight from the dashboard forms (no need to paste a URL). Files are saved to
`server/src/uploads/{images,videos,documents}` and served back at
`http://localhost:5000/uploads/...`. This works out of the box with no Cloudinary setup required;
set the `CLOUDINARY_*` env vars only if you want to swap in cloud storage instead. Limits: images
5MB (jpg/jpeg/png/webp), videos 30MB (mp4/webm/mov), documents 10MB (pdf/jpg/png/webp).


## Scope Limitations (per SRS)

- **No payment gateway** — checkout produces an order *request* only.
- **Physical delivery** is outside this application's scope.
- **Veterinarian credential authentication** (verifying real-world licensing) is outside this application's scope; the app manages appointments and profiles, not license verification.

## Deployment

- **Backend:** deploy to Render/Railway/Fly.io; set all env vars there, point `MONGO_URI` at your Atlas cluster, set `CLIENT_URL` to your deployed frontend origin.
- **Frontend:** deploy to Vercel/Netlify; set `VITE_API_URL` to your deployed backend URL.
