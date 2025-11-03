import React, { forwardRef } from "react";
import Logo from "../../assets/logo.jpeg";

const PrintSlip = forwardRef(({ user }, ref) => {
  return (
    <div
      ref={ref}
      className="w-[600px] mx-auto bg-white text-black font-mono p-6 border border-gray-400 rounded shadow-sm"
    >
      <div className="flex flex-col items-center border-b border-gray-400 pb-2">
        <img src={Logo} alt="Logo" className="h-16 w-16 object-contain mb-2" />
        <h1 className="text-xl font-bold tracking-widest uppercase">
          Malik Foundation
        </h1>
        <p className="text-xs text-gray-600">
          Non-profit Organization · Karachi, Pakistan
        </p>
      </div>

      <div className="flex justify-between mt-3">
        <div>
          <p className="text-sm">
            <span className="font-semibold">Receipt #:</span>{" "}
            {user?.id || "N/A"}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Token #:</span>{" "}
            {user?.token_no || "N/A"}
          </p>
        </div>
        <div className="text-center mt-3">
          <p className="text-sm">
            <span className="font-semibold">Date:</span>{" "}
            {user?.created_at?.slice(0, 10) || "N/A"}
          </p>
        </div>
      </div>

      <div className="mt-4 border-t border-b border-gray-300 py-3">
        <div className="flex text-sm mb-1">
          <span className="font-semibold">Patient Name:</span>
          <span className="pl-3">{user?.patient_name}</span>
        </div>
        <div className="flex text-sm mb-1">
          <span className="font-semibold">Doctor Name:</span>
          <span className="pl-3">{user?.doctor_name}</span>
        </div>
        <div className="flex text-sm mb-1">
          <span className="font-semibold">Age:</span>
          <span className="pl-3">{user?.age}</span>
        </div>
        <div className="flex text-sm mb-1">
          <span className="font-semibold">Gender:</span>
          <span className="pl-3">{user?.gender}</span>
        </div>
      </div>

      <div className="mt-4 border-b border-gray-300 pb-2">
        <div className="flex justify-between text-sm font-semibold mb-1">
          <span>Sr.</span>
          <span>Detail</span>
          <span>Total</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>01</span>
          <span className="capitalize Fees">{`${user?.type_name} fees`}</span>
          <span>
            {`${
              user?.type_name === "appointment"
                ? user?.doctor_fee
                : user?.pharmacy_fees
            } Rs.`}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 text-xs text-gray-700">
        <p className="mt-1"> Appointment once booked is non-refundable.</p>
        <p className="mt-1"> For donations or queries: 📞 0300-6254553</p>
        <p className="mt-1"> info@malikkhidmatfoundation.com</p>
      </div>

      <div className="flex justify-between text-xs mt-2 pt-2 border-t border-gray-400">
        <span className="font-semibold">Receptionist Sign</span>
        <span className="font-semibold">Welfare Stamp</span>
      </div>

      <p className="text-center text-xs mt-10 text-gray-500">
        Malik Foundation © {new Date().getFullYear()}
      </p>
    </div>
  );
});

export default PrintSlip;
