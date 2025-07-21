import React from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { IoMdHome } from "react-icons/io";
import { HiUser } from "react-icons/hi2";
import { FaUserDoctor, FaSheetPlastic } from "react-icons/fa6";
import { Link, Outlet, useLocation } from "react-router-dom";

const RootLayout = () => {
  const isToggle = true;
  const location = useLocation();

  const CustomMenu = ({ link, text, Icon }) => (
    <MenuItem
      icon={<Icon className="text-2xl" />}
      style={{
        backgroundColor: location.pathname === link ? "#004aa3" : "#fff",
        borderRadius: location.pathname === link ? "10px" : 0
      }}
      className={`font-bold p-2 ${
        location.pathname === link ? "text-white" : "text-black"
      }`}
      component={<Link to={link} />}
    >
      {text}
    </MenuItem>
  );

  return (
    <div className="flex min-h-[90vh]">
      <div className="w-[250px]">
        <Sidebar breakPoint="lg" toggled={isToggle} onBackdropClick={null}>
          <Menu className="!bg-white !min-h-[90vh]">
            <CustomMenu link="/" text="Home" Icon={IoMdHome} />
            <CustomMenu
              link="/patientslip"
              text="Slips"
              Icon={FaSheetPlastic}
            />
            <CustomMenu link="/users" text="Users" Icon={HiUser} />
            <CustomMenu link="/doctors" text="Doctors" Icon={FaUserDoctor} />
          </Menu>
        </Sidebar>
      </div>

      <main className="flex-1 p-4 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
