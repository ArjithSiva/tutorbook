# TutorBook

A full-stack tutoring lesson booking marketplace built with React, Express, and MongoDB.

Students browse tutor listings, filter by subject/price, and book lessons.
Tutors create listings, manage their availability, and confirm/complete bookings.
After a lesson is completed, students can leave a rating and review.

## Project structure

```
tutorbook/
  backend/     Express + MongoDB API (JWT auth, services, bookings, reviews)
  frontend/    React (Vite) client
```

## 1. Run the backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
- `MONGO_URI` — your MongoDB Atlas connection string (see below for how to get one)
- `JWT_SECRET` — any long random string
- `PORT` — 5000 by default
- `CLIENT_URL` — http://localhost:5173 for local dev

```bash
npm run dev
```

The API will run at `http://localhost:5000`. Visit `http://localhost:5000/api/health` to confirm it's up.

## 2. Run the frontend

```bash
cd frontend
npm install
cp .env.example .env
```

`.env` should have `VITE_API_URL=http://localhost:5000/api` (already the default).

```bash
npm run dev
```

Visit `http://localhost:5173`.

## 3. Try it out

https://tutorbook-ten.vercel.app/

1. Register two accounts: one as a **tutor**, one as a **student**.
2. Log in as the tutor, create a lesson listing.
3. Log in as the student, browse, and book that listing.
4. Log back in as the tutor, confirm the booking, then mark it completed.
5. Log back in as the student and leave a review.

## Setting up a free MongoDB Atlas cluster

1. Go to https://www.mongodb.com/cloud/atlas/register and create a free account.
2. Create a new **free (M0) cluster** — any cloud provider/region is fine.
3. Under **Database Access**, create a database user with a username and password (save these).
4. Under **Network Access**, add your current IP, or `0.0.0.0/0` (allow from anywhere) for easy local development.
5. Go to your cluster, click **Connect > Drivers**, copy the connection string. It looks like:
   `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/`
6. Paste it into `backend/.env` as `MONGO_URI`, replacing `<username>` and `<password>` with your database user's credentials, and add a database name at the end, e.g. `.../tutorbook?retryWrites=true&w=majority`.

## Deployment (all free tiers)

**Database:** MongoDB Atlas (already set up above).

**Backend → Render**
1. Push this project to a GitHub repo.
2. On https://render.com, create a **New Web Service**, connect your repo, set the root directory to `backend`.
3. Build command: `npm install`. Start command: `npm start`.
4. Add environment variables (`MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`) in Render's dashboard.
5. Deploy — Render gives you a URL like `https://tutorbook-api.onrender.com`.

**Frontend → Vercel**
1. On https://vercel.com, import the same GitHub repo, set root directory to `frontend`.
2. Framework preset: Vite.
3. Add environment variable `VITE_API_URL` = your Render backend URL + `/api` (e.g. `https://tutorbook-api.onrender.com/api`).
4. Deploy — Vercel gives you a URL like `https://tutorbook.vercel.app`.

**Final step:** go back to Render and update `CLIENT_URL` to your Vercel URL so CORS allows it, then redeploy the backend.

## Tech stack

- **Frontend:** React 18, React Router, Axios, Vite
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB
- **Auth:** JWT + bcrypt password hashing
