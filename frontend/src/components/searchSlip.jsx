import React, { useState } from "react";
import { axiosClient } from "../utils/AxiosClient";
import { useMainContext } from "../context/mainContext";
import { toast } from "react-toastify";

function SearchSlip({ setFilteredSearch }) {
  const { doctors } = useMainContext();
  const [doctorName, setDoctorName] = useState("");
  const [patientName, setPatientName] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showNo, setShowNo] = useState(false);

  const fetchFilteredSlips = async () => {
    try {
      const params = {
        ...(doctorName && { doctor_id: doctorName }),
        ...(patientName && { search: patientName }),
        ...(status && { status }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate })
      };
      const response = await axiosClient.get("/api/patient-slips", { params });
      setFilteredSearch(response?.data);
      if (response?.data?.length < 1) {
        setShowNo(true);
      } else {
        setShowNo(false);
      }
    } catch (err) {
      console.error("Error fetching filtered slips:", err);
      toast.error("Error fetching slips");
    }
  };

  return (
    <div className="pb-5 border-b-1 border-b-[#004aa3] mb-4">
      <div className="w-full xl:w-[90%] mb-5  flex flex-wrap gap-3 mt-7  items-center justify-center ">
        <select
          value={doctorName}
          onChange={(e) => setDoctorName(e.target.value)}
          className="border p-2 rounded min-w-[17%]"
        >
          <option value="">Select Doctor</option>
          {doctors.map((doc) => (
            <option key={doc?.id} value={doc?.id}>
              {`Dr. ${doc?.doctor_name}`}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Patient Name"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          className="border p-2 rounded min-w-[17%]"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 rounded min-w-[17%]"
        >
          <option value="">Select Status</option>

          <option key={1} value="1">
            Active
          </option>
          <option key={2} value="2">
            Inactive
          </option>
        </select>
        <input
          placeholder="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 rounded min-w-[17%]"
        />
        <input
          placeholder="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 rounded min-w-[17%]"
        />
        <button
          onClick={fetchFilteredSlips}
          className="bg-[#004aa3] text-white py-2 px-4 rounded"
        >
          Search
        </button>
      </div>
      {showNo && (
        <div>
          <p className="text-center font-bold text-xl">No Data Found</p>
        </div>
      )}
    </div>
  );
}

export default SearchSlip;
