/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";

import axios from "axios";
import { toast } from "react-toastify";

export const UserContext = createContext();

const UserContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const getUser = async (token) => {
    try {
      const res = await axios.post(
        backendUrl + "/api/user/userInfo",
        {},
        { headers: { token } }
      );
      if (res.data.success) {
        setUser(res.data.userProfile);
      }
    } catch (error) {
      console.log(error);

      toast.error(error);
    }
  };
  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  useEffect(() => {
    getUser(token);
  }, [token]);

  const value = {
    user,
    setUser,
  };

  return (
    <UserContext.Provider value={value}>{props.children}</UserContext.Provider>
  );
};
export default UserContextProvider;
