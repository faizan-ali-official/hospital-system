import { Routes, Route, useLocation } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import {
  DoctorCreate,
  Doctors,
  Home,
  Login,
  Slips,
  UserCreate,
  Users,
  Reports,
  DeletedSlips,
  Services,
  ServiceCreate,
  Discounts,
  DiscountCreate,
  CommunityCard,
  CommunityCardCreate
} from "../../pages";
import { useIsOnline } from "react-use-is-online";
import { useMainContext } from "../../context/mainContext";
import { HiChevronDown } from "react-icons/hi2";

const pathToSection = {
  "/": "Home",
  "/patientslip": "Slips",
  "/communitycard": "Community Card",
  "/users": "Employees",
  "/usercreate": "Employees",
  "/doctors": "Doctors",
  "/doctorcreate": "Doctors",
  "/services": "Services",
  "/servicecreate": "Services",
  "/discounts": "Discounts",
  "/discountcreate": "Discounts",
  "/reports": "Reports",
  "/deletedslips": "Deleted Slips",
  "/communitycardcreate": "Community Card",
};

function getSectionLabel(pathname) {
  return pathToSection[pathname] ?? (pathname.slice(1).split("/")[0] || "Home");
}

function getInitials(name) {
  if (!name || typeof name !== "string") return "—";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

const RouterPage = () => {
  const { user } = useMainContext();
  const { isOnline, isOffline } = useIsOnline();
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const sectionLabel = getSectionLabel(location.pathname);

  if (isLoginPage) {
    return <Routes><Route path="/login" element={<Login />} /></Routes>;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Thin green bar */}
      <div className="flex-shrink-0 h-1 bg-emerald-500" />
      <header className="flex-shrink-0 z-40 bg-slate-100 border-b border-slate-200">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-4 py-1.5 text-sm font-medium text-emerald-800">
            {sectionLabel}
          </span>
          {user?.id && isOnline && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-200 text-sm font-semibold text-sky-800">
                {getInitials(user?.name || user?.username)}
              </div>
              <span className="hidden sm:inline text-sm font-medium text-slate-800 capitalize truncate max-w-[160px]">
                {user?.name || user?.username}
              </span>
              <HiChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" aria-hidden />
            </div>
          )}
        </div>
      </header>
      <div className="flex-1 min-h-0 overflow-hidden">
        <Routes>
        {user?.id || isOffline ? (
          <Route element={<RootLayout />}>
            {user?.role === "admin" ? (
              <>
                <Route path="/" element={<Home />} />
                <Route path="/users" element={<Users />} />
                <Route path="/usercreate" element={<UserCreate />} />
                <Route path="/doctors" element={<Doctors />} />
                <Route path="/doctorcreate" element={<DoctorCreate />} />
                <Route path="/services" element={<Services />} />
                <Route path="/patientslip" element={<Slips />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/deletedslips" element={<DeletedSlips />} />
                <Route path="/servicecreate" element={<ServiceCreate />} />
                <Route path="/discounts" element={<Discounts />} />
                <Route path="/discountcreate" element={<DiscountCreate />} />
                <Route path="/communitycard" element={<CommunityCard />} />
                <Route
                  path="/communitycardcreate"
                  element={<CommunityCardCreate />}
                />
              </>
            ) : (
              <>
                <Route path="/" element={<Home />} />
                <Route path="/patientslip" element={<Slips />} />
                <Route path="/communitycard" element={<CommunityCard />} />
              </>
            )}
          </Route>
        ) : null}
        </Routes>
      </div>
    </div>
  );
};

export default RouterPage;
