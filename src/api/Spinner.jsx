import React from "react";
import { useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";

const Spinner = () => {
  let [loading, setLoading] = useState(true);
  let [color, setColor] = useState("#ffffff");
  return (
    <div className="flex justify-center items-center h-screen w-full">
      <BeatLoader
        color="#c61d23"
        loading
        margin={8}
        size={18}
        speedMultiplier={1}
      />
    </div>
  );
};

export default Spinner;
