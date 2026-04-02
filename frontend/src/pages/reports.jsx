import React, { useEffect, useRef, useState } from "react";
import ReportTypeButton from "../components/reportTypeButton";
import { axiosClient } from "../utils/AxiosClient";
import { useMainContext } from "../context/mainContext";
import SearchSlip from "../components/searchSlip";
import { HiOutlinePrinter } from "react-icons/hi2";

const Reports = () => {
  const tableContainerRef = useRef(null);
  const { today } = useMainContext();
  const [doctorName, setDoctorName] = useState("");
  const [reportData, setReportData] = useState({});
  const [reportName, setReportName] = useState("1");
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(() => {
    return today.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return today.toISOString().split("T")[0];
  });

  const endpoint =
    reportName == 1
      ? "/api/report/patient-slip-appointment/"
      : "/api/report/patient-slip-pharmacy/";

  const fetchData = async () => {
    const params = {
      ...(doctorName && { doctor_id: doctorName }),
      // ...(patientName && { search: patientName }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate })
    };

    try {
      const repData = await axiosClient.get(endpoint, {
        params
      });
      setReportData(repData.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [reportName]);

  const handlePrint = () => {
    if (!tableContainerRef?.current) return;

    const printContent = tableContainerRef.current.innerHTML;
    const printWindow = window.open("", "", "width=1000,height=1000");

    printWindow.document.write(`
      <html>
        <head>
          <title>Records Report</title>
          <style>
            @page {
              size: A4;
              margin: 15mm;
            }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              margin: 0;
              padding: 20px;
            }
            
            /* LAYOUT STYLING */
            .flex { display: flex !important; }
            .justify-around { justify-content: space-around !important; }
            .justify-center { justify-content: center !important; }
            .items-center { align-items: center !important; }
            .flex-col { flex-direction: column !important; }
            .w-[250px] {
              width:500px
            }
            /* MAIN CARD CONTAINER */
            .shadow-lg {
              border: 1px solid #004aa3; /* Shadow doesn't print well, border is better */
              border-radius: 8px;
              padding: 40px 0;
              margin-top: 20px;
            }
  
            /* BLUE BOXES */
            .bg-\\[\\#004aa3\\] {
              background-color: #004aa3 !important;
              color: white !important;
              border-radius: 12px;
              width: 40% !important;
              min-height: 150px !important;
              display: flex !important;
              flex-direction: column !important;
              justify-content: center !important;
              align-items: center !important;
              /* CRITICAL FOR PRINTING COLOR */
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
  
            /* TEXT STYLING */
            .text-white { color: white !important; }
            .font-bold { font-weight: bold !important; }
            .text-2xl { font-size: 24px !important; margin: 5px 0; }
            
            /* UTILITIES */
            .print-hidden { display: none !important; }
            .min-h-\\[60vh\\] { min-height: auto !important; margin-top: 50px; }
            .w-full { width: 100% !important; }
  
            @media print {
              .print-hidden { display: none !important; }
            }
            
          </style>
        </head>
        <body>
          <h1 style="text-align: center; color: #004aa3;"></h1>
          <h1 style="text-align: center; color: #004aa3;">${
            reportName == 1 ? "Appoinment " : "Pharmacy"
          } Report Summary</h1>
          ${printContent}
          <script>
            window.onload = function() {
              window.print();
              // window.close(); // Uncomment if you want the window to close after printing
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="flex justify-center min-h-0 flex-1" ref={tableContainerRef}>
      <div className="w-full xl:w-[95%] max-w-4xl flex flex-col overflow-hidden">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">
          Reports
        </h2>

        <div className="print-hidden space-y-4">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <ReportTypeButton
              setReportName={setReportName}
              reportName={reportName}
            />
            <button
              type="button"
              onClick={handlePrint}
              className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
            >
              <HiOutlinePrinter className="w-4 h-4" />
              Print
            </button>
          </div>
          <SearchSlip
            setFilteredSearch={setReportData}
            isreport={true}
            endpoint={endpoint}
            handlePrint={handlePrint}
          />
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              No of Slips
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-800 dark:text-slate-100">
              {reportData.slips_count ?? 0}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Total Earning
            </p>
            <p className="mt-2 text-2xl font-bold text-[#004aa3] dark:text-sky-400">
              Rs. {reportData.total_amount ?? "0.00"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
