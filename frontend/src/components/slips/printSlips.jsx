import React, { forwardRef } from "react";
import Logo from "../../assets/logo.jpeg";

const PrintSlip = forwardRef(({ user }, ref) => {
  return (
    <div
      ref={ref}
      className="w-[80mm] mx-auto bg-white text-black font-mono text-[11px] px-2 py-1"
    >
      <div className="flex flex-col items-center border-b border-black pb-1">
        <img src={Logo} alt="Logo" className="h-15 w-15 object-contain mb-2" />
        <h1 className="text-sm font-bold uppercase tracking-wide text-center">
          Malik Foundation
        </h1>
        <p className="text-[10px] py-2 text-center">
          Non-profit Organization · Karachi, Pakistan
        </p>
          <p className="text-[16px] text-center">
            <span className="font-semibold">Token#:</span>{" "}
            {user?.token_no || "N/A"}
          </p>
      </div>
      <div className="flex justify-between mt-1">
        <div>
          <p>
            <span className="font-semibold">Receipt#:</span> {user?.id || "N/A"}
          </p>
        </div>
        <div className="text-right">
          <p>
            <span className="font-semibold">Date:</span>{" "}
           {new Date(user?.created_at).toLocaleDateString('en-GB').replace(/\//g, '-')|| "N/A"}
          </p>
        </div>
      </div>
      <div className="mt-2 border-t border-b border-gray-700 py-1">
        <p>
          <span className="font-semibold">Patient:</span>{" "}
          {user?.patient_name || "-"}
        </p>
        <p>
          <span className="font-semibold">Doctor:</span>{" "}
          {user?.doctor_name || "-"}
        </p>
        <p>
          <span className="font-semibold">Age:</span> {user?.age || "-"}
        </p>
        <p>
          <span className="font-semibold">Gender:</span> {user?.gender || "-"}
        </p>
      </div>
      <div className="mt-2 border-b border-gray-700 pb-1">
        <div className="flex justify-between font-semibold border-b border-gray-700 pb-1">
          <span>Sr.</span>
          <span>Detail</span>
          <span>Total</span>
        </div>
        <div className="flex justify-between mt-1 py-2">
          <span>01</span>
          <span className="capitalize">{user?.type_name} fees</span>
          <span >
            {user?.type_name === "appointment"
              ? ` Rs. ${user?.doctor_fee}`
              : `Rs. ${user?.pharmacy_fees}`}
          </span>
        </div>
      </div>
      <div className="mt-1 text-[10px] py-1 leading-tight">
        <p>Appointment once booked is non-refundable.</p>
      </div>
      <div className="flex justify-between text-[10px] mt-2 pt-3 border-t border-gray-700">
        <span>📞 0300-6254553</span>
        <span>info@malikkhidmatfoundation.com</span>
      </div>
      <p className="text-center text-[10px] mt-4 text-black italic pb-3">
       Developed by UA Digital 
      </p>
    </div>
  );
});

export default PrintSlip;
