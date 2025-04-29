// eslint-disable-next-line no-unused-vars
import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.jsx";
import ShopContextProvider from "./context/ShopContext.jsx";
import UserContextProvider from "./context/UserContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <GoogleOAuthProvider clientId="627437376889-ursq8glfrvs35cun4tqsmr5hoa2jnob8.apps.googleusercontent.com">
      <UserContextProvider>
        <ShopContextProvider>
          <App />
        </ShopContextProvider>
      </UserContextProvider>
    </GoogleOAuthProvider>
  </BrowserRouter>
);
