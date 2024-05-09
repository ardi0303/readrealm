"use client"

import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { auth } from "../../../firebase";
import Auth from ".";
import Home from "../Home";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

export const AuthPageHandler = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuth(true);
      } else {
        setIsAuth(false);
      }
    });
  }, []);

  if (isAuth === null) {
    return null;
  }else if (isAuth) {
    if (children === undefined) {
      return <Navigate to="/" />;
    }else{
      return <>{children}</>;
    }
  } else {
    return <Auth />;
  }
};