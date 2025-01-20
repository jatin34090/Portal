import React, { useEffect } from "react";
import Navbar from "./Form/Navbar";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetails } from "../redux/slices/userDeailsSlice";

const Result = () => {
  const dispatch = useDispatch();

  const { userDetails } = useSelector((state) => state.userDetails);

  useEffect(() => {
    dispatch(fetchUserDetails());
    console.log("userDetails", userDetails);
  }, []);
  useEffect(() => {
    dispatch(fetchUserDetails());
    console.log("userDetails", userDetails);
  }, [userDetails]);

  return (
    <div
      className=" overflow-auto w-full h-screen"
      style={{ backgroundColor: "#c61d23" }}
    >
      <div className="grid grid-cols-7 w-full h-screen">
        <div className="col-span-1">
          <Sidebar />
        </div>

        <div className="flex flex-col col-span-6 ">
          {/* <div className=" pr-8 flex gap-12 justify-between items-center"> */}
          <Navbar />

          {/* </div> */}

          <div className="flex justify-center items-center  rounded-lg w-full h-full p-9">
            <div className="flex justify-center items-center bg-white w-full h-full rounded-lg">
              {userDetails?.admitCard && (
                <a
                  href={userDetails?.admitCard}
                  download="ReportCard.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  style={{ backgroundColor: "#c61d23" }}
                >
                  Download Your Report Card
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;
