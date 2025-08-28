import React, { useEffect, useState } from "react";
import ReportTypeButton from "../components/reportTypeButton";
import { axiosClient } from "../utils/AxiosClient";
import { useMainContext } from "../context/mainContext";
import SearchSlip from "../components/searchSlip";

const Reports = () => {
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
      console.log(repData, "red");
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

  return (
    <div>
      <ReportTypeButton setReportName={setReportName} reportName={reportName} />
      <SearchSlip
        setFilteredSearch={setReportData}
        isreport={true}
        endpoint={endpoint}
      />
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
