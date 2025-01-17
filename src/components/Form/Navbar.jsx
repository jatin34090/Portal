import React from "react";
import { Link, useLocation } from "react-router-dom";
import NotificationWithIndicator from "../../assets/NotificationWithIndicator.png";

import NotificationWithoutIndicator from "../../assets/NotificationWithoutIndicator.png";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { userData: userDetails } = useSelector((state) => state.userDetails);

  const pathLocation = useLocation().pathname;
  return (
    <div className=" pr-8 flex gap-12 justify-between items-center">
      <div className="pl-10 py-2 flex gap-7 ">
        <Link
          to={"/basicDetailsForm"}
          className={`${
            pathLocation === "/basicDetailsForm"
              ? "bg-gray-200 text-black "
              : "text-white"
          }  p-2 rounded-xl`}
        >
          Basic/Batch{" "}
        </Link>
        <Link
          to={"/educationalDetailsForm"}
          className={`${
            pathLocation === "/educationalDetailsForm"
              ? "bg-gray-200 text-black "
              : "text-white"
          } p-2 rounded-xl`}
        >
          Educational/Family{" "}
        </Link>
      </div>
      <div className="flex items-center justify-center my-2 gap-12">
        {userDetails?.profile ? (
          <img src={userDetails.profile} alt="" />
        ) : (
          <div className="flex justify-center items-center gap-3 ">
            <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center text-lg font-bold">
              {userDetails?.name?.slice(0, 2).toUpperCase()}
            </div>
            <h4 className="text-white">{userDetails?.name}</h4>
          </div>
        )}

        <img src={NotificationWithoutIndicator} alt="" />
      </div>
    </div>
  );
};

export default Navbar;
