# 🎨 Frontend Overview

## 🧱 Tech Stack

- Framework: React
- State Management: Context API
- Routing: React Router DOM
- HTTP Client: Axios
- Styling: Tailwind CSS
- Authentication: JWT with protected routes
- Deployment: Netlify

## 📁 Project Structure

```
src/
├── assets/              # Images, icons, and static files
├── components/          # Reusable components (e.g. Navbar, Loader)
├── pages/               # Route-based pages (e.g. Home, ProductDetails)
├── context/             # Global state using React Context
├── App.jsx              # Main App with route structure
└── main.jsx             # Root entry point
```

## 🧠 Key Concepts

### 🔄 State Management

The app uses Context API to manage global state like:

- Auth state
- Cart data
- Products and orders

### 🔐 Auth Flow

- On login, a JWT token is saved in localStorage.
- Token is used in Axios headers to access protected APIs.

### 📦 API Integration

- Axios instance configured with a base URL and auth token.
- API calls organized for modular access.

## 🛠️ Contribution Tips

- Follow consistent coding styles.
- Use meaningful commit messages.
- Pull from main before pushing changes.
- Create PRs for new features or bug fixes.
