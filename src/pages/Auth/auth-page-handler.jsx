import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { auth } from "../../../firebase";
import Auth from ".";
import { Navigate } from "react-router-dom";

export const AuthPageHandler = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);

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
  } else if (isAuth) {
    if (children === undefined) {
      return <Navigate to="/" />;
    } else {
      return <>{children}</>;
    }
  } else {
    return <Auth />;
  }
};
