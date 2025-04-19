# 🛠️ Backend Overview

## 🚧 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT + bcrypt + OTP (email-based)
- **Payments**: Stripe API
- **File Upload**: Multer
- **Environment Config**: dotenv
- **Deployment**: Render

---

## 📁 Project Structure

```bash
backend/
├── controllers/         # Route logic (e.g., userController, productController)
├── models/              # Mongoose schemas
├── routes/              # API route definitions
├── middlewares/         # Auth, error handling, etc.
├── utils/               # Helper functions (e.g., email sender, OTP generator)
├── config/              # DB connection, Stripe config
├── .env                 # Environment variables
├── server.js            # Entry point
└── package.json
```

---

## 🔐 Authentication Flow

- Users register/login with email and password.
- Passwords are hashed using `bcrypt`.
- JWT is generated on login and sent to frontend.
- Admin-only APIs are protected via middleware.
- OTP verification is used for added security or password reset.

---

## 💼 Admin Functionality

Admins can:

- Add, update, or delete products
- View and process orders

Protected by `adminMiddleware`.

---

## 🛒 Key Modules

### 🧑‍💻 User Module

- Register / Login
- Get Profile
- Update Profile
- OTP verification
- JWT Authentication

### 📦 Product Module

- CRUD for products
- Reviews system
- Category/tags/filters

### 📬 Order Module

- Create order
- View order history
- Stripe payment integration

### 💳 Stripe Integration

- `POST /create-checkout-session` → Stripe checkout
- Webhook listens for payment success

---

## 🔐 Middleware

- `authMiddleware` – verifies JWT
- `adminMiddleware` – checks admin role
- `multer` – upload image management

---

## 🌍 API Documentation

Base URL:

```txt
http://localhost:5000/api
```

Example Endpoints:

```bash
POST   /api/users/register
POST   /api/users/login
GET    /api/users/profile
POST   /api/products
GET    /api/products/:id
POST   /api/orders
POST   /api/payments/checkout
```

---

## 🚀 Running Locally

1. Clone the repo:

```bash
git clone https://github.com/Learnathon-By-Geeky-Solutions/codeclusters
cd codeclusters/backend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file:

```env
PORT = your_port
MONGODB_URI ="your mongoDb uri"
JWT_SECRET = "Provide_secret"
EMAIL_USER = "example@mail.com"
EMAIL_PASS = "password"
ADMIN_EMAIL = "example@mail.com"
ADMIN_PASSWORD = "password"
STRIPE_SECRET_KEY ='your_stripe_secret_key'
```

4. Start the server:

```bash
npm run dev
```

---

## 🔁 Available Scripts

```bash
npm run server      # Run with nodemon
npm start         # Run in production
```

---

## 🛠️ Deployment

Make sure to:

- Set up environment variables in your hosting platform
- Use `build` folder from frontend in `server.js` for production
- Add a health check route (e.g. `/api/health`)

---

## 📌 Tips

- Keep tokens/keys in `.env`, never push them.
- Use try-catch and async/await for clean error handling.
- Keep controller logic modular and small.
- Modularize routes and keep them RESTful.

---

## ✅ Example `.env`

```env
PORT = your_port
MONGODB_URI ="your mongoDb uri"
JWT_SECRET = "Provide_secret"
EMAIL_USER = "example@mail.com"
EMAIL_PASS = "password"
ADMIN_EMAIL = "example@mail.com"
ADMIN_PASSWORD = "password"
STRIPE_SECRET_KEY ='your_stripe_secret_key'
```
