import React, { useState } from "react";
import CheckupSlip from "../components/slipTypes/checkupSlip";
import PharmacySlip from "../components/slipTypes/pharmacySlip";

function Home() {
  const [selectedType, setSelectedType] = useState("doctor");

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full xl:w-[60%] lg:w-[80%] mx-10 xl:mx-0 py-10 items-start rounded-md shadow-lg shadow-[#004aa3]">
        <div className="flex">
          {selectedType && (
            <button
              className="pl-10 text-3xl cursor-pointer"
              onClick={() => setSelectedType("")}
            >
              ←
            </button>
          )}
          <p className="text-center pb-2 font-bold text-2xl underline w-full capitalize">
            {selectedType} Slip
          </p>
        </div>
        {!selectedType ? (
          <>
            <p className="text-center pb-6 font-semibold text-xl w-full ">
              Kindly select an option
            </p>
            <div className="flex justify-around">
              <div
                className="w-[40%] min-h-[20vh] bg-[#004aa3] rounded-xl"
                onClick={() => setSelectedType("doctor")}
              >
                <p className="flex justify-center h-[100%] items-center font-bold text-white text-2xl cursor-pointer">
                  Appointment Slip
                </p>
              </div>
              <div
                className="w-[40%] min-h-[20vh] bg-[#004aa3] rounded-xl cursor-pointer"
                onClick={() => setSelectedType("pharmacy")}
              >
                <p className="flex justify-center h-[100%] items-center font-bold text-white text-2xl">
                  Pharmacy Slip
                </p>
              </div>
            </div>
          </>
        ) : selectedType === "doctor" ? (
          <CheckupSlip />
        ) : (
          <PharmacySlip />
        )}
      </div>
    </div>
  );
}

export default Home;
