import React, { useEffect, useRef, useState } from "react";
import ReportTypeButton from "../components/reportTypeButton";
import { axiosClient } from "../utils/AxiosClient";
import { useMainContext } from "../context/mainContext";
import SearchSlip from "../components/searchSlip";

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
    <div ref={tableContainerRef}>
      <div className="print-hidden">
        <ReportTypeButton
          setReportName={setReportName}
          reportName={reportName}
        />
        <SearchSlip
          setFilteredSearch={setReportData}
          isreport={true}
          endpoint={endpoint}
          handlePrint={handlePrint}
        />
      </div>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-full xl:w-[50%] mx-10 xl:mx-0 py-10 items-start rounded-md shadow-lg shadow-[#004aa3]">
          <div className="flex justify-around ">
            <div className="w-[40%] min-h-[20vh] bg-[#004aa3] rounded-xl">
              <div className="h-[100%] flex items-center justify-center flex-col">
                <p className="font-bold text-white text-2xl">No of Slips</p>
                <p className="font-bold text-white text-2xl">
                  {reportData.slips_count}
                </p>
              </div>
            </div>
            <div className="w-[40%] min-h-[20vh] bg-[#004aa3] rounded-xl">
              <div className="h-[100%] flex items-center justify-center flex-col">
                <p className="font-bold text-white text-2xl">Total Earning</p>
                <p className="font-bold text-white text-2xl">
                  Rs. {reportData.total_amount}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
