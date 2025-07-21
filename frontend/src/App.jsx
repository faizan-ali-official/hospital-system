// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RootLayout from "./components/layouts/RootLayout";
import {
  Home,
  Login,
  UserCreate,
  Users,
  DoctorCreate,
  Doctors,
  Slips
} from "./pages";
import { FaHandshake } from "react-icons/fa";
import Logo from "./assets/logo.jpeg";
import "./App.css";
import { MainContextProvider } from "./context/mainContext";
function App() {
  return (
    <>
      {/* <div className="bg-white border-b border-red-50 shadow-lg shadow-red-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 py-6 flex items-center gap-3">
          <FaHandshake className="text-red-500 text-3xl" />
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-red-500 via-gray-800 to-red-500 text-transparent bg-clip-text drop-shadow-md tracking-wide uppercase">
            NGO - Karachi
          </h1>
        </div>
      </div>
       */}

      <div className="bg-white border-b border-[#004aa3] shadow-lg shadow-[#004aa3]/30">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 py-6 flex items-center gap-3">
          {/* Replace the src with your actual logo path */}
          <img
            src={Logo}
            alt="Malik Foundation Logo"
            className="h-10 w-10 object-contain"
          />
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#004aa3] via-gray-800 to-[#004aa3] text-transparent bg-clip-text drop-shadow-md tracking-wide uppercase">
            Malik Foundation
          </h1>
        </div>
      </div>
      <Router>
        <MainContextProvider>
          <Routes>
            <Route element={<RootLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/users" element={<Users />} />
              <Route path="/usercreate" element={<UserCreate />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/doctorcreate" element={<DoctorCreate />} />
              <Route path="/patientslip" element={<Slips />} />
            </Route>
            <Route path="/login" element={<Login />} />
          </Routes>
        </MainContextProvider>
      </Router>
    </>
  );
}

export default App;
