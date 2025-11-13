import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/loader/loader";
import { axiosClient } from "../utils/AxiosClient";
import { toast } from "react-toastify";

const mainContext = createContext({
  user: null,
  allUsers: [],
  doctors: [],
  allSlips: [],
  feesTypes: [],
  setAllSlips: () => {},
  setDoctors: () => {},
  setAllUsers: () => {},
  setFeesTypes: () => {},
  fetchUserProfile: () => {},
  logOutHandler: () => {}
});

export const useMainContext = () => useContext(mainContext);

export const MainContextProvider = ({ children }) => {
  const today = new Date();

  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [allSlips, setAllSlips] = useState([]);
  const [deleteSlips, setDeleteSlips] = useState([]);
  const [feesTypes, setFeesTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const params = {
    startDate: today.toISOString().split("T")[0],
    endDate: today.toISOString().split("T")[0]
  };
  const fetchUserProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      navigate("/login");
      return;
    }
    try {
      const resp = await axiosClient.post("/api/auth/refresh", {
        refreshToken: token
      });
      localStorage.setItem("accessToken", resp?.data?.accessToken);
      localStorage.setItem("user", resp?.data?.user);
      setUser(resp?.data?.user);
      const userResp = await axiosClient.get("/api/user/");
      setAllUsers(userResp?.data);
      const docResp = await axiosClient.get("/api/doctor/");
      setDoctors(docResp?.data);
      const slipResp = await axiosClient.get("/api/patient-slips/", { params });
      setAllSlips(slipResp?.data);
      const feesResp = await axiosClient.get("/api/fees/");
      setFeesTypes(feesResp?.data);
      const deleteSlipResp = await axiosClient.get(
        "/api/patient-slips?limit=100&offset=0&deleted=true"
      );
      setDeleteSlips(deleteSlipResp?.data);
      navigate("/");
    } catch (error) {
      console.error(error);
      setUser(null);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const logOutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  useEffect(() => {
    fetchUserProfile();
    monitorInternetConnection();
  }, []);

  const saveDataOffline = (data) => {
    let storedData = JSON.parse(localStorage.getItem("offlineData")) || [];
    storedData.push(data);
    localStorage.setItem("offlineData", JSON.stringify(storedData));
  };

  const syncDataOnline = async () => {
    let storedData = JSON.parse(localStorage.getItem("offlineData")) || [];
    if (storedData.length === 0) return;
    try {
      await axiosClient.post("/api/patient-slips/bulk", storedData);
      localStorage.removeItem("offlineData");
      toast.success("Data synced successfully!");
      console.log("Data synced successfully!");
    } catch (error) {
      console.error("Sync failed, will retry later", error);
    }
  };

  const monitorInternetConnection = () => {
    window.addEventListener("online", () => {
      console.log("Internet connected, syncing...");
      syncDataOnline();
    });
    window.addEventListener("offline", () => {
      console.log("Internet disconnected, saving offline.");
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center w-full">
        <Loader />
      </div>
    );
  }

  return (
    <mainContext.Provider
      value={{
        user,
        allUsers,
        today,
        doctors,
        allSlips,
        feesTypes,
        deleteSlips,
        fetchUserProfile,
        logOutHandler,
        setAllUsers,
        setAllSlips,
        setDoctors,
        setFeesTypes,
        setDeleteSlips,
        monitorInternetConnection,
        saveDataOffline
      }}
    >
      {children}
    </mainContext.Provider>
  );
};
