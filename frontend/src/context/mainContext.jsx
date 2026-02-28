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
  services: [],
  discounts: [],
  communityCard: [],
  sidebarMobileOpen: false,
  setSidebarMobileOpen: () => {},
  theme: "light",
  setTheme: () => {},
  setAllSlips: () => {},
  setDoctors: () => {},
  setAllUsers: () => {},
  setFeesTypes: () => {},
  setServices: () => {},
  setDiscounts: () => {},
  setCommunityCard: () => {},
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
  const [services, setServices] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [communityCard, setCommunityCard] = useState([]);
  const [feesTypes, setFeesTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const [theme, setThemeState] = useState(() => {
    if (typeof window === "undefined") return "light";
    return localStorage.getItem("theme") || "light";
  });

  const setTheme = (value) => {
    setThemeState(value);
    localStorage.setItem("theme", value);
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", value === "dark");
    }
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const navigate = useNavigate();
  const params = {
    startDate: today.toISOString().split("T")[0],
    endDate: today.toISOString().split("T")[0]
  };
  const fetchUserProfile = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setLoading(false);
      navigate("/login");
      return;
    }
    try {
      const loginUser = JSON.parse(localStorage.getItem("user"));
      setUser(loginUser);
      const userResp = await axiosClient.get("/api/user/");
      setAllUsers(userResp?.data);
      const docResp = await axiosClient.get("/api/doctor/");
      setDoctors(docResp?.data);
      const slipResp = await axiosClient.get("/api/patient-slips/", { params });
      setAllSlips(slipResp?.data);
      const feesResp = await axiosClient.get("/api/fees/");
      setFeesTypes(feesResp?.data);
      const servicesResp = await axiosClient.get("/api/services/");
      setServices(servicesResp?.data);
      const communityCardResp = await axiosClient.get("/api/community-cards/");
      setServices(servicesResp?.data);
      setCommunityCard(communityCardResp?.data);
      const discountsResp = await axiosClient.get("/api/discounts/");
      setDiscounts(discountsResp?.data);
      const deleteSlipResp = await axiosClient.get(
        "/api/patient-slips?limit=100&offset=0&deleted=true"
      );
      setDeleteSlips(deleteSlipResp?.data);
    } catch (error) {
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
    } catch (error) {
      console.error("Sync failed, will retry later", error);
    }
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
        services,
        discounts,
        communityCard,
        sidebarMobileOpen,
        setSidebarMobileOpen,
        theme,
        setTheme,
        fetchUserProfile,
        logOutHandler,
        setAllUsers,
        setAllSlips,
        setDoctors,
        setFeesTypes,
        setDeleteSlips,
        setServices,
        setDiscounts,
        setCommunityCard,
        saveDataOffline
      }}
    >
      {children}
    </mainContext.Provider>
  );
};
