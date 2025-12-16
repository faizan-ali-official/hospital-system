import { Routes, Route } from "react-router-dom";
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
  CommunityCard,
  CommunityCardCreate
} from "../../pages";
import Logo from "../../assets/logo.jpeg";
import { useIsOnline } from "react-use-is-online";
import { useMainContext } from "../../context/mainContext";

const RouterPage = () => {
  const { user } = useMainContext();
  const { isOnline, isOffline } = useIsOnline();
  return (
    <>
      <div className="bg-white border-b border-[#004aa3] shadow-lg shadow-[#004aa3]/30">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10 py-6 gap-3 flex items-center justify-between">
          <div className=" ">
            <div className=" flex items-center">
              <img
                src={Logo}
                alt="Malik Foundation Logo"
                className="h-10 w-10 object-contain"
              />
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#004aa3] via-gray-800 to-[#004aa3] text-transparent bg-clip-text drop-shadow-md tracking-wide uppercase">
                Malik Khidmat Foundation
              </h1>
            </div>
            <p className="text-sm text-gray-600 font-medium mt-1">
              Non-profit organization · Non-governmental organization (NGO) ·
              Charity organization
            </p>
          </div>
          {user?.id && isOnline && (
            <div>
              <p className="capitalize font-bold">
                {user?.name || user?.username}
              </p>
              <p className="capitalize">{user?.role}</p>
            </div>
          )}
        </div>
      </div>
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
              </>
            )}
          </Route>
        ) : (
          <Route path="/login" element={<Login />} />
        )}
      </Routes>
    </>
  );
};

export default RouterPage;
