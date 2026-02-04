import React from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { IoMdHome } from "react-icons/io";
import { HiClipboardDocumentList, HiUser, HiTag } from "react-icons/hi2";
import { FaUserDoctor, FaSheetPlastic } from "react-icons/fa6";
import { FaAddressCard } from "react-icons/fa";
import { HiDocumentMagnifyingGlass, HiDocumentMinus } from "react-icons/hi2";
import { Link, Outlet, useLocation } from "react-router-dom";
import CustomAuthButton from "../customButton";
import { useMainContext } from "../../context/mainContext";

const RootLayout = () => {
  const isToggle = true;
  const location = useLocation();
  const { logOutHandler, user } = useMainContext();

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
    <div className="flex max-h-[calc(100vh - 113px)]">
      <div className="w-[250px]">
        <Sidebar breakPoint="lg" toggled={isToggle} onBackdropClick={null}>
          <Menu className="!bg-white !max-h-[90vh] flex flex-col justify-between">
            <div>
              <CustomMenu link="/" text="Home" Icon={IoMdHome} />
              <CustomMenu
                link="/patientslip"
                text="Slips"
                Icon={FaSheetPlastic}
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
                    link="/communitycard"
                    text="Community Card"
                    Icon={FaAddressCard}
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
            <div className="m-4 mb-6">
              <CustomAuthButton text="Logout" onClick={() => logOutHandler()} />
            </div>
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
