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
import Logo from "./assets/logo.jpeg";
import "./App.css";
import { MainContextProvider } from "./context/mainContext";
import { ToastContainer } from "react-toastify";
import CustomAuthButton from "./components/customButton";
function App() {
  return (
    <>
      <div className="bg-white border-b border-[#004aa3] shadow-lg shadow-[#004aa3]/30">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 py-6 flex justify-between gap-3">
          <div className=" flex items-center">
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
      </div>
      <Router>
        <MainContextProvider>
          <ToastContainer />
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
