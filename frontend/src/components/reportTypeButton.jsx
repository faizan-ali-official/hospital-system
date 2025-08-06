import React from "react";

function ReportTypeButton({ setReportName, reportName }) {
  return (
    <div className="w-full flex justify-center mt-3">
      <div className="bg-gray-300 w-[500px] flex rounded-2xl ">
        <div
          className={`${
            reportName == 1 && "bg-[#004aa3]"
          } min-h-12 w-[250px] items-center flex justify-center rounded-2xl`}
          onClick={() => setReportName("1")}
        >
          <p className="text-white font-bold text-xl w-full text-center">
            Appoinment
          </p>
        </div>
        <div
          className={`${
            reportName == 2 && "bg-[#004aa3]"
          } min-h-12 w-[250px] items-center flex justify-center rounded-2xl`}
          onClick={() => setReportName("2")}
        >
          <p className="text-white font-bold text-xl w-full text-center">
            Pharmacy
          </p>
        </div>
      </div>
    </div>
  );
}

export default ReportTypeButton;
