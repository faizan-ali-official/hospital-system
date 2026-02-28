import React from "react";

function ReportTypeButton({ setReportName, reportName }) {
  return (
    <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 p-1 shadow-sm">
      <button
        type="button"
        onClick={() => setReportName("1")}
        className={`rounded-md px-5 py-2 text-sm font-semibold transition-colors ${
          reportName == "1"
            ? "bg-[#004aa3] dark:bg-sky-600 text-white shadow-sm"
            : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
        }`}
      >
        Appointment
      </button>
      <button
        type="button"
        onClick={() => setReportName("2")}
        className={`rounded-md px-5 py-2 text-sm font-semibold transition-colors ${
          reportName == "2"
            ? "bg-[#004aa3] dark:bg-sky-600 text-white shadow-sm"
            : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
        }`}
      >
        Pharmacy
      </button>
    </div>
  );
}

export default ReportTypeButton;
