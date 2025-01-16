import React from "react";
import ScholarsDenLogo from "../assets/scholarsDenLogo.png";
import DashboardDarkMode from "../assets/DashboardDarkMode.png";
import DashboardLightMode from "../assets/DashboardLightMode.png";
import PaymentDarkMode from "../assets/PaymentDarkMode.png";
import PaymentLightMode from "../assets/PaymentLightMode.png";
import RegistrationDarkMode from "../assets/RegistrationDarkMode.png";
import RegistrationLightMode from "../assets/RegistrationLightMode.png";
import LogoutLightMode from "../assets/LogoutLightMode.png"
import { useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  return (
    <div
      className="flex flex-col justify-between h-screen"
      style={{ backgroundColor: "#c61d23" }}
    >
      <div className=" flex flex-col items-center pt-10 gap-8">
        <div className="flex flex-col gap-1 items-center">
          <img className="w-16 h-16" src={ScholarsDenLogo} alt="" />
          <span className="text-white mt-3">Student Panel</span>
        </div>

        <div
          className={`flex gap-3 w-full rounded-l-full ml-16 p-3 ${
            location.pathname === "/basicDetailsForm"
              ? "text-red-600 bg-white "
              : "text-white"
          } `}
        >
          <img
            src={
              location.pathname === "/basicDetailsForm"
                ? DashboardDarkMode
                : DashboardLightMode
            }
            alt=""
          />
          <h4>Dashboard</h4>
        </div>
        <div
          className={`flex gap-3 w-full rounded-l-full ml-16 p-3 ${
            location.pathname === "/basicDetailsForm"
              ? "text-red-600 bg-white "
              : "text-white"
          } `}
        >
          <img
            src={
              location.pathname === "/basicDetailsForm"
                ? PaymentDarkMode
                : PaymentLightMode
            }
            alt=""
          />
          <h4>Payment Info</h4>
        </div>
        <div
          className={`flex gap-3 w-full rounded-l-full ml-16 p-3 ${
            location.pathname === "/basicDetailsForm"
              ? "text-red-600 bg-white "
              : "text-white"
          } `}
        >
          <img
            src={
              location.pathname === "/basicDetailsForm"
                ? RegistrationDarkMode
                : RegistrationLightMode
            }
            alt=""
          />
          <h4>Registration</h4>
        </div>
      </div>

      <div
          className={`flex gap-3 w-full rounded-l-full ml-16 px-3 pb-16  text-white `}
        >
          <img
            src={LogoutLightMode}
            alt=""
          />
          <h4>Logout</h4>
        </div>
    </div>
  );
};

export default Sidebar;
