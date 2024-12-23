import React from "react";

const SubNavbar = ({ text }) => {
  return (
    <div className="p-10 m-0 bg-gray-200">
      <h3 className="text-2xl flex justify-center">{`Student ${text} Panel`}</h3>
      <span className="flex text-gray-400 justify-center">
        Fill this form to register yourself with Scholars Den.
      </span>
    </div>
  );
};

export default SubNavbar;
