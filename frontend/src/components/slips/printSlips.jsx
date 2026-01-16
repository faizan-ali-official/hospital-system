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
          Malik Medical Health Center
        </h1>
        <p className="text-[10px] py-2 text-center">
          Non-profit Organization · Karachi, Pakistan
        </p>
        <p className="text-[16px] text-center">
          <span className="font-semibold">
            {user?.slip_type_name === "appointment"
              ? "Token No. : "
              : "Reference Id : "}
          </span>{" "}
          {user?.slip_type_name === "appointment"
            ? user?.token_no || "N/A"
            : user?.reference_token_no || "N/A"}
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
            {new Date(user?.created_at)
              .toLocaleDateString("en-GB")
              .replace(/\//g, "-") || "N/A"}
          </p>
        </div>
      </div>
      <div className="mt-2 border-t border-b border-gray-700 py-1">
        <p>
          <span className="font-semibold capitalize">Patient:</span>{" "}
          {user?.patient_name || "-"}
        </p>
        <p>
          <span className="font-semibold">Doctor:</span>{" "}
          {`Dr. ${user?.doctor_name}` || "-"}
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
          <span></span>
        </div>
        {(() => {
          let rows = [];
          let total = 0;
          let counter = 1;
          if (user?.slip_type_name === "appointment" && user?.doctor_fee) {
            rows.push(
              <div key="appointment" className="flex justify-between mt-1 py-2">
                <span>{String(counter).padStart(2, "0")}</span>
                <span>Appointment Fee</span>
                <span>Rs. {user?.doctor_fee}</span>
              </div>
            );
            total += Number(user?.doctor_fee);
            counter++;
          }
          if (user?.pharmacy_fees) {
            rows.push(
              <div key="pharmacy" className="flex justify-between mt-1 py-2">
                <span>{String(counter).padStart(2, "0")}</span>
                <span>Pharmacy Fees</span>
                <span>Rs. {user?.pharmacy_fees}</span>
              </div>
            );
            total += Number(user?.pharmacy_fees);
            counter++;
          }
          if (user?.services?.length) {
            user.services.forEach((service) => {
              rows.push(
                <div
                  key={service.id}
                  className="flex justify-between mt-1 py-2"
                >
                  <span>{String(counter).padStart(2, "0")}</span>
                  <span>{service.name}</span>
                  <span>Rs. {service.fees}</span>
                </div>
              );
              total += Number(service.fees);
              counter++;
            });
          }
          return (
            <>
              {rows}
              <div className="text-center">
                {user?.is_card_holder &&
                  `Fees is ${
                    user?.doctor_fee * 2
                  } but you are card holder so 50% is off`}
              </div>
              <div className="flex justify-between font-bold border-t border-gray-600 pt-2 mt-2">
                <span>Total</span>
                <span>Rs. {total}</span>
              </div>
            </>
          );
        })()}
      </div>
      <div className="mt-1 text-[10px] py-1 leading-tight">
        <p>Appointment once booked is non-refundable.</p>
      </div>
      <div className="text-center text-[10px] mt-2 pt-3 border-t border-gray-700">
        <p>📞0300-6254553</p>
        <p>info@malikkhidmatfoundation.com</p>
      </div>
      <p className="text-center text-[10px] mt-4 text-black italic pb-3">
        Developed by UA Digital
      </p>
    </div>
  );
});

export default PrintSlip;
