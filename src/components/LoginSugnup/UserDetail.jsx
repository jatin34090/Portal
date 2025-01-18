import React, { useEffect, useState } from "react";
import UserDetails from "../../assets/UserDetails.png";

import EditUserDetails from "../../assets/EditUserDetails.png";
import PaymentDue from "../../assets/PaymentDue.png";

const UserDetail = () => {
  const [userDetailShow, setUserDetailShow] = useState(false);

  const UserDetailsPage = () => {
    {console.log("UserDetailsPage is running");}
    return (
      userDetailShow && (
        <div className="absolute bg-green-600 z-50 top-0 left-0 right-0 bottom-0 blur-2xl  ">

          {console.log("UserDetailsPage  internal div is running")}

          <div className="flex flex-col justify-center items-center w-1/2 h-1/2 bg-sky-600">
            sdfg
          </div>
        </div>
      )
    );
  };

  useEffect(() => {
    console.log("userDetailShow", userDetailShow);
    if (userDetailShow) {
      UserDetailsPage();
    }
  }, [userDetailShow]);

  return (
    <div className="flex flex-col justify-start items-start h-full w-full">
      <h2 className="text-2xl font-semibold mb-1 ">User</h2>

      <div className="flex flex-col gap-4 justify-center h-full w-full">
        <div
          className="bg-white w-full h-1/3 hover:border-4 cursor-pointer border-red-600 rounded-xl shadow-xl flex flex-col justify-center items-center gap-1 "
          onClick={() => setUserDetailShow(true)}
        >
          <div className="flex flex-col justify-center items-center ">
            <img className="w-20 h-20" src={UserDetails} alt="" />
            <h4 className="text-2xl text-center font-semibold">
              {" "}
              User
              <br /> Details
            </h4>
          </div>
        </div>
        <div className="bg-white w-full h-1/3 hover:border-4 cursor-pointer border-red-600 rounded-xl shadow-xl flex flex-col justify-center items-center gap-1 ">
          <div className="flex flex-col justify-center items-center ">
            <img className="w-20 h-20" src={EditUserDetails} alt="" />

            <h4 className="text-2xl text-center font-semibold">
              {" "}
              Edit User
              <br /> Details
            </h4>
          </div>
        </div>
        <div className="bg-white w-full h-1/3 hover:border-4 cursor-pointer border-red-600 rounded-xl shadow-xl flex flex-col justify-center items-center gap-1 ">
          <div className="flex flex-col justify-center items-center ">
            <img className="w-20 h-20" src={PaymentDue} alt="" />

            <h4 className="text-2xl text-center font-semibold">
              {" "}
              Payment
              <br /> Due
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
