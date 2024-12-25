import React from "react";

const ResultPage = () => {
const resultDetails = async()=>{
    const response = await axios.get("/students/")
}

  return (
    <div className="flex justify-center items-center ">
      <div className="flex flex-col justify-center items-center shadow-lg p-6 rounded-lg">
        
        Result
      </div>
    </div>
  );
};

export default ResultPage;
