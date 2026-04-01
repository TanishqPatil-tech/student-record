# 📚 Student Record Manager — MERN Stack

A full-stack web application for managing student records, built with MongoDB, Express.js, React.js, and Node.js.

---

## 🗂 Project Structure

```
student-record-manager/
├── backend/
│   ├── middleware/
│   │   └── auth.js           # JWT authentication middleware
│   ├── models/
│   │   ├── User.js           # User schema (hashed passwords)
│   │   └── Student.js        # Student schema
│   ├── routes/
│   │   ├── auth.js           # POST /signup, POST /login, GET /me
│   │   └── students.js       # Full CRUD for students
│   ├── .env.example
│   ├── package.json
│   └── server.js             # Express entry point
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   └── Navbar.js
    │   ├── context/
    │   │   └── AuthContext.js  # Global auth state
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Signup.js
    │   │   ├── Dashboard.js
    │   │   ├── Students.js
    │   │   └── StudentForm.js  # Add & Edit combined
    │   ├── services/
    │   │   └── api.js          # Axios instance + all API calls
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    ├── .env.example
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm or yarn
- MongoDB Atlas account (free tier works)

---

### 1. Clone / Download the project

```bash
git clone <your-repo-url>
cd student-record-manager
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` from the example:

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/studentDB?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key_min_32_chars
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

> **MongoDB Atlas Setup:**
> 1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
> 2. Create a free cluster
> 3. Create a database user (username + password)
> 4. Whitelist your IP (or use `0.0.0.0/0` for development)
> 5. Click "Connect" → "Connect your application" → copy the URI

Start the backend:

```bash
npm run dev      # development (with nodemon)
# or
npm start        # production
```

Backend runs at: `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create `.env` from the example:

```bash
cp .env.example .env
```

Edit `.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm start
```

Frontend runs at: `http://localhost:3000`

---

## 🔌 API Reference

### Auth Endpoints

| Method | Endpoint           | Description              | Auth Required |
|--------|--------------------|--------------------------|---------------|
| POST   | `/api/auth/signup` | Register new user        | ❌            |
| POST   | `/api/auth/login`  | Login and receive token  | ❌            |
| GET    | `/api/auth/me`     | Get current user info    | ✅            |

**Request body for `/signup`:**
```json
{ "name": "John Doe", "email": "john@example.com", "password": "secret123" }
```

**Request body for `/login`:**
```json
{ "email": "john@example.com", "password": "secret123" }
```

---

### Student Endpoints (all require `Authorization: Bearer <token>`)

| Method | Endpoint              | Description              |
|--------|-----------------------|--------------------------|
| GET    | `/api/students`       | Get all students         |
| GET    | `/api/students/:id`   | Get single student       |
| POST   | `/api/students`       | Create new student       |
| PUT    | `/api/students/:id`   | Update student           |
| DELETE | `/api/students/:id`   | Delete student           |

**Query params for GET `/api/students`:**
- `search` — filter by name or course (case-insensitive)
- `course` — filter by exact course match

**Request body for POST/PUT:**
```json
{ "name": "Priya Sharma", "age": 20, "course": "Computer Science", "email": "priya@example.com" }
```

---

## ☁️ Deployment

### Backend — Render (Free)

1. Push backend folder to GitHub
2. Go to [https://render.com](https://render.com) → New → Web Service
3. Connect your GitHub repo
4. Set:
   - **Build command:** `npm install`
   - **Start command:** `node server.js`
   - **Environment variables:** Add all keys from `.env`
5. Deploy → copy your service URL

### Frontend — Vercel (Free)

1. Push frontend folder to GitHub
2. Go to [https://vercel.com](https://vercel.com) → New Project
3. Import your repo
4. Set environment variable:
   - `REACT_APP_API_URL` = `https://your-render-backend-url.onrender.com/api`
5. Deploy → your app is live!

> Don't forget to update `CLIENT_URL` in your backend `.env` on Render to point to your Vercel URL.

---

## 🔐 Security Features

- Passwords hashed with **bcryptjs** (12 salt rounds)
- JWT tokens with **7-day expiry**
- Protected routes — all student APIs require a valid token
- Token verified on every request via middleware
- CORS configured to allow only frontend origin

---

## 🛠 Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React.js 18, React Router v6      |
| HTTP      | Axios                             |
| Backend   | Node.js, Express.js               |
| Database  | MongoDB Atlas                     |
| ODM       | Mongoose                          |
| Auth      | JWT + bcryptjs                    |
| Toasts    | react-hot-toast                   |
| Hosting   | Vercel (FE) + Render (BE)         |

---

## 📄 License

MIT — free to use and modify.
