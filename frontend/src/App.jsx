// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RootLayout from "./components/layouts/RootLayout";
import { Home, About, Login } from "./pages";
import { FaHandshake } from "react-icons/fa";
import "./App.css";
function App() {
  return (
    <>
      <div className="bg-white border-b border-red-50 shadow-lg shadow-red-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 py-6 flex items-center gap-3">
          <FaHandshake className="text-red-500 text-3xl" />
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-red-500 via-gray-800 to-red-500 text-transparent bg-clip-text drop-shadow-md tracking-wide uppercase">
            NGO - Karachi
          </h1>
        </div>
      </div>
      <Router>
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Route>

          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
