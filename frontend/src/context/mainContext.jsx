import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import Loader from "@/components/Loader";
import { axiosClient } from "../utils/AxiosClient";
// import { toast } from "react-toastify";

const mainContext = createContext({
  user: null,
  allUsers: [],
  doctors: [],
  allSlips: [],
  setAllSlips: () => {},
  setDoctors: () => {},
  setAllUsers: () => {},
  fetchUserProfile: () => {},
  logOutHandler: () => {}
});

export const useMainContext = () => useContext(mainContext);

export const MainContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [allSlips, setAllSlips] = useState([]);

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const resp = await axiosClient.post("/api/auth/refresh", {
        refreshToken: token
      });
      localStorage.setItem("accessToken", resp?.data?.accessToken);
      setUser(resp?.data?.user);
      const userResp = await axiosClient.get("/api/user/");
      setAllUsers(userResp?.data);
      const docResp = await axiosClient.get("/api/doctor/");
      setDoctors(docResp?.data);
      const slipResp = await axiosClient.get("/api/patient-slips/");
      console.log(slipResp);
      setAllSlips(slipResp?.data);
      navigate("/");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const logOutHandler = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
    // toast.success("Logged out successfully");
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  //   if (loading) {
  //     return (
  //       <div className="min-h-screen flex items-center justify-center w-full">
  //         <Loader />
  //       </div>
  //     );
  //   }

  return (
    <mainContext.Provider
      value={{
        user,
        allUsers,
        doctors,
        allSlips,
        fetchUserProfile,
        logOutHandler,
        setAllUsers,
        setAllSlips,
        setDoctors
      }}
    >
      {children}
    </mainContext.Provider>
  );
};
