import React, { forwardRef } from "react";
import Logo from "../../assets/logo.jpeg";

const PrintSlip = forwardRef(({ user }, ref) => {
  return (
    <div ref={ref} className=" p-6 text-black">
      <div className="bg-white border-b border-[#004aa3] shadow-lg shadow-[#004aa3]/30">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 py-6 flex justify-between gap-3">
          <div className=" flex items-center">
            <img
              src={Logo}
              alt="Malik Foundation Logo"
              className="h-10 w-10 object-contain"
            />
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#004aa3] via-gray-800 to-[#004aa3] text-transparent bg-clip-text drop-shadow-md tracking-wide uppercase">
              Malik Foundation
            </h1>
          </div>
        </div>
      </div>
      <p>
        <strong>Patient:</strong> {user.patient_name}
      </p>
      <p>
        <strong>Doctor:</strong> {user.doctor_name}
      </p>
      <p>
        <strong>Status:</strong> {user.status}
      </p>
      <p>
        <strong>Date:</strong> {user.createdAt?.slice(0, 10)}
      </p>
    </div>
  );
});

export default PrintSlip;
