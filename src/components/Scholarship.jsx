import React from "react";
import Scholarsship from "../assets/Scholarsship.png";

const Scholarship = () => {
  return (
    <div className="flex justify-between h-4/5 w-full">
      <div className="bg-white w-full h-full p-7">
        <h3 className="text-2xl font-bold mb-4">
          SDAT<br className="p-0"/>
          Scholarsship
        </h3>
        <button className="py-2 px-10 text-white font-semibold rounded-full " style={{ backgroundColor: "#c61d23" }}>View</button>
      </div>
      <div className="flex justify-end bg-white w-full h-full p-7">
        <img src={Scholarsship} alt="" />
      </div>
    </div>
  );
};

export default Scholarship;
