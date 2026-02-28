import React, { useState, useEffect } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { IoMdHome } from "react-icons/io";
import {
  HiClipboardDocumentList,
  HiUser,
  HiTag,
  HiArrowRightOnRectangle,
  HiChevronLeft
} from "react-icons/hi2";
import Logo from "../../assets/logo.jpeg";
import { FaUserDoctor, FaSheetPlastic } from "react-icons/fa6";
import { FaAddressCard } from "react-icons/fa";
import { HiDocumentMagnifyingGlass, HiDocumentMinus } from "react-icons/hi2";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useMainContext } from "../../context/mainContext";

const navItemClass =
  "flex items-center gap-3 w-full py-2.5 px-3 text-sm font-medium transition-all duration-200 rounded-r-lg";

const RootLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isLg, setIsLg] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 1024 : true
  );
  const location = useLocation();
  const { logOutHandler, user, sidebarMobileOpen, setSidebarMobileOpen, theme } =
    useMainContext();

  const isDark = theme === "dark";
  const sidebarBg = isDark ? "#1e293b" : "#ffffff";
  const sidebarBorder = isDark ? "1px solid #334155" : "1px solid #e2e8f0";

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const handler = () => setIsLg(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (!isLg) setSidebarMobileOpen(false);
  }, [location.pathname, isLg, setSidebarMobileOpen]);

  const sidebarToggled = isLg || sidebarMobileOpen;

  const isActive = (link) => location.pathname === link;

  const CustomMenu = ({ link, text, Icon }) => (
    <MenuItem
      component={<Link to={link} />}
      className="!mb-0.5"
      style={{ backgroundColor: "transparent" }}
    >
      <span
        className={`${navItemClass} border-l-4 ${
          isActive(link)
            ? "border-l-[#004aa3] dark:border-l-sky-400 bg-[#004aa3]/10 dark:bg-sky-400/20 text-[#004aa3] dark:text-sky-300"
            : "border-transparent hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200"
        }`}
      >
        <Icon className="w-5 h-5 flex-shrink-0 text-inherit" />
        {!collapsed && <span>{text}</span>}
      </span>
    </MenuItem>
  );

  return (
    <div className="flex h-full min-h-0 w-full">
      <div className="flex-shrink-0 h-full overflow-hidden flex flex-col">
        <Sidebar
          collapsed={collapsed}
          breakPoint="lg"
          toggled={sidebarToggled}
          onBackdropClick={() => setSidebarMobileOpen(false)}
          backgroundColor={sidebarBg}
          rootStyles={{
            backgroundColor: sidebarBg,
            borderRight: sidebarBorder,
            height: "100%",
            minHeight: "0"
          }}
        >
          <div className="flex flex-col h-full min-h-0 py-3">
            <div className="flex-shrink-0 flex items-center justify-between gap-2 px-3 mb-4">
              <div className={`flex items-center gap-2 ${collapsed ? "min-w-9 justify-center" : "min-w-0"}`}>
                <img
                  src={Logo}
                  alt="MMHC"
                  className="h-9 w-9 flex-shrink-0 rounded-lg object-cover border border-slate-200 dark:border-slate-600"
                />
                {!collapsed && (
                  <span className="text-sm font-semibold truncate text-slate-800 dark:text-slate-200">
                    MMHC
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setCollapsed((c) => !c)}
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <HiChevronLeft
                  className={`w-4 h-4 transition-transform ${
                    collapsed ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
            <Menu
              className="sidebar-menu !bg-transparent !border-0 flex-1 min-h-0 overflow-y-hidden overflow-x-hidden"
              menuItemStyles={{
                button: {
                  padding: "0 8px",
                  "&:hover": { backgroundColor: "transparent" }
                }
              }}
            >
              <div className="px-2 space-y-0">
                <CustomMenu link="/" text="Home" Icon={IoMdHome} />
                <CustomMenu
                  link="/patientslip"
                  text="Slips"
                  Icon={FaSheetPlastic}
                />
                <CustomMenu
                  link="/communitycard"
                  text="Community Card"
                  Icon={FaAddressCard}
                />
                {user?.role === "admin" && (
                  <>
                    <CustomMenu link="/users" text="Users" Icon={HiUser} />
                    <CustomMenu
                      link="/doctors"
                      text="Doctors"
                      Icon={FaUserDoctor}
                    />
                    <CustomMenu
                      link="/services"
                      text="Services"
                      Icon={HiClipboardDocumentList}
                    />
                    <CustomMenu
                      link="/discounts"
                      text="Discounts"
                      Icon={HiTag}
                    />
                    <CustomMenu
                      link="/reports"
                      text="Reports"
                      Icon={HiDocumentMagnifyingGlass}
                    />
                    <CustomMenu
                      link="/deletedslips"
                      text="Deleted Slips"
                      Icon={HiDocumentMinus}
                    />
                  </>
                )}
              </div>
            </Menu>
            <div className="flex-shrink-0 px-2 py-2 border-t border-slate-200 dark:border-slate-600">
              <button
                type="button"
                onClick={() => logOutHandler()}
                className={`flex items-center gap-3 w-full py-2.5 pl-5 pr-3 text-sm font-medium transition-all duration-200 rounded-r-lg justify-start border-l-4 border-transparent hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 text-slate-800 dark:text-slate-200`}
              >
                <HiArrowRightOnRectangle className="w-5 h-5" />
                {!collapsed && <span>Logout</span>}
              </button>
            </div>
          </div>
        </Sidebar>
      </div>
      <main className="flex-1 min-w-0 min-h-0 overflow-y-auto p-4 sm:p-6 bg-slate-50/80 dark:bg-slate-900">
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
