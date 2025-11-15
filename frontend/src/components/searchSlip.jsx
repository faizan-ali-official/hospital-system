import React, { useEffect, useState } from "react";
import { axiosClient } from "../utils/AxiosClient";
import { useMainContext } from "../context/mainContext";
import { toast } from "react-toastify";
import BtnLoader from "./loader/btnLoader";

function SearchSlip({
  setFilteredSearch,
  isreport,
  endpoint,
  setShowNo,
  showNo
}) {
  const { doctors, today, allUsers } = useMainContext();
  const [doctorName, setDoctorName] = useState("");
  const [patientName, setPatientName] = useState("");
  const [user, setUser] = useState("");
  const [slipType, setSlipType] = useState("");
  const [slipId, setSlipID] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(() => {
    return today.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return today.toISOString().split("T")[0];
  });

  const fetchFilteredSlips = async () => {
    setLoading(true);
    try {
      const params = {
        ...(doctorName && { doctor_id: doctorName }),
        ...(patientName && { search: patientName }),
        ...(user && { created_by: user }),
        ...(slipType && { slip_type_id: Number(slipType) }),
        ...(status && { status }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate })
      };

      let apiUrl = "/api/patient-slips";
      if (isreport) {
        apiUrl = endpoint;
      } else if (slipId) {
        apiUrl = `/api/patient-slips/${slipId}`;
        setSlipID("");
      }

      const response = await axiosClient.get(apiUrl, { params });
      setFilteredSearch(
        isreport
          ? response?.data || []
          : response?.data
          ? Array.isArray(response.data)
            ? response.data
            : [response.data]
          : []
      );
      if (!isreport) {
        if (response?.data?.length < 1) {
          setShowNo(true);
        } else {
          setShowNo(false);
        }
      }
    } catch (err) {
      toast.error("Error fetching slips");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isreport) {
      fetchFilteredSlips();
    }
  }, []);

  return (
    <div className="pb-5 border-b-1 border-b-[#004aa3] mb-4 flex justify-center">
      <div className="w-full xl:w-[90%] mb-5 flex flex-wrap gap-3 mt-7 items-center justify-center">
        <div className="flex flex-col min-w-[14%]">
          <label className="mb-1 text-sm text-gray-700">Doctor</label>
          <select
            value={doctorName}
            onChange={(e) => setDoctorName(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Select Doctor</option>
            {doctors.map((doc) => (
              <option key={doc?.id} value={doc?.id}>
                {`Dr. ${doc?.doctor_name}`}
              </option>
            ))}
          </select>
        </div>
        {!isreport ? (
          <>
            <div className="flex flex-col min-w-[14%]">
              <label className="mb-1 text-sm text-gray-700">Patient Name</label>
              <input
                type="text"
                placeholder="Patient Name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="border p-2 rounded"
              />
            </div>
            <div className="flex flex-col min-w-[14%]">
              <label className="mb-1 text-sm text-gray-700">Slip ID</label>
              <input
                type="text"
                placeholder="Slip ID"
                value={slipId}
                onChange={(e) => setSlipID(e.target.value)}
                className="border p-2 rounded"
              />
            </div>
            <div className="flex flex-col min-w-[14%]">
              <label className="mb-1 text-sm text-gray-700">Slip Type</label>
              <select
                value={slipType}
                onChange={(e) => setSlipType(e.target.value)}
                className="border p-2 rounded"
              >
                <option value="">Select Type</option>
                <option value="1">appointment</option>
                <option value="2">pharmacy</option>
              </select>
            </div>
          </>
        ) : (
          <div className="flex flex-col min-w-[14%]">
            <label className="mb-1 text-sm text-gray-700">User</label>
            <select
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">Select User</option>
              {allUsers.map((user) => (
                <option key={user?.id} value={user?.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="flex flex-col min-w-[14%]">
          <label className="mb-1 text-sm text-gray-700">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
        <div className="flex flex-col min-w-[14%]">
          <label className="mb-1 text-sm text-gray-700">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
        <div className="flex flex-col justify-end mt-6">
          <button
            onClick={fetchFilteredSlips}
            disabled={loading}
            className="bg-[#004aa3] w-[80px] text-white py-2 flex justify-center rounded mt-5 xl:mt-0"
          >
            {loading ? <BtnLoader /> : "Search"}
          </button>
        </div>
      </div>
      {showNo && (
        <div>
          <p
            className="text-center font-bold text-xl cursor-pointer"
            onClick={() => setShowNo(false)}
          >
            Clear Filter
          </p>
        </div>
      )}
    </div>
  );
}

export default SearchSlip;
