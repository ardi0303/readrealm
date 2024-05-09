import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import DetailBook from "./pages/DetailBook";
import Favorites from "./pages/Favorites";
import { AuthPageHandler } from "./pages/Auth/auth-page-handler";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div>
      <ToastContainer />
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/auth"
              element={
                <AuthPageHandler>
                  <Auth />
                </AuthPageHandler>
              }
            />
            {/* Menggunakan AuthPageHandler langsung di dalam Route */}
            <Route
              path="/detail-book/:id"
              element={
                <AuthPageHandler>
                  <DetailBook />
                </AuthPageHandler>
              }
            />
            <Route path="/favorites" element={<Favorites />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
