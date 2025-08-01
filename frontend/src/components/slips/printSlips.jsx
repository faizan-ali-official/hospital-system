import React, { forwardRef } from "react";
import Logo from "../../assets/logo.jpeg";

const PrintSlip = forwardRef(({ user }, ref) => {
  return (
    <div ref={ref} className="min-h-screen p-6 flex flex-col justify-between">
      <div>
        <div className="bg-white border-b border-[#004aa3] shadow-lg shadow-[#004aa3]/30">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 py-6 justify-between gap-3">
            <div className="flex items-center">
              <img
                src={Logo}
                alt="Malik Foundation Logo"
                className="h-10 w-10 object-contain"
              />
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#004aa3] via-gray-800 to-[#004aa3] text-transparent bg-clip-text drop-shadow-md tracking-wide uppercase">
                Malik Foundation
              </h1>
            </div>
            <p className="text-sm text-gray-600 font-medium mt-1">
              Non-profit organization · Non-governmental organization (NGO) ·
              Charity organization
            </p>
          </div>
        </div>
        <div className="border border-gray-300 rounded p-6 mt-8 shadow-md w-full">
          <h2 className="text-3xl font-bold mb-4 text-center border-b pb-2">
            Patient Information
          </h2>
          <p className="text-2xl mt-3 my-2 text-right">
            <strong>Token No : </strong> {user?.token_no}
          </p>
          <p className="text-2xl my-2">
            <strong>Patient Name : </strong> {user?.patient_name}
          </p>
          <p className="text-2xl my-2">
            <strong>Doctor Name : </strong> {user?.doctor_name}
          </p>
          <p className="text-2xl my-2">
            <strong>Age : </strong> N/A
          </p>
          <p className="text-2xl my-2">
            <strong>Gender : </strong> N/A
          </p>
          <p className="text-2xl my-2">
            <strong>Status : </strong>{" "}
            {user?.status == "1" ? "Active" : "Inactive"}
          </p>
          <p className="text-2xl">
            <strong>Date :</strong> {user?.created_at?.slice(0, 10)}
          </p>
        </div>
        <div className="flex justify-between mt-25 ">
          <div className="text-xl text-gray-700 text-left border-t border-gray-400 pt-2 w-1/3">
            Receptionist Sign
          </div>
          <div className="text-xl text-gray-700 text-right border-t border-gray-400 pt-2 w-1/3">
            Welfare Stamp
          </div>
        </div>
      </div>
      <div>
        <p className="text-[#004aa3] text-xl font-bold">Contact Information</p>
        <div className="mt-2 text-lg text-gray-700 flex flex-wrap gap-x-6 gap-y-2">
          <p className="flex items-center gap-1">
            📞 <span>0300 6254553</span>
          </p>
          <p className="flex items-center gap-1">
            📧 <span>info@malikkhidmatfoundation.com</span>
          </p>
          <p className="flex items-center gap-1">
            📍 <span>Karachi, Pakistan</span>
          </p>
        </div>
      </div>
    </div>
  );
});

export default PrintSlip;
