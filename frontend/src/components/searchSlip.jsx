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
  showNo,
  handlePrint,
  startShareDate,
  setStartShareDate,
  endShareDate,
  setShareEndDate
}) {
  const { doctors, today, allUsers, discounts } = useMainContext();
  const [doctorName, setDoctorName] = useState("");
  const [patientName, setPatientName] = useState("");
  const [user, setUser] = useState("");
  const [slipType, setSlipType] = useState("");
  const [slipId, setSlipID] = useState("");
  const [status, setStatus] = useState("");
  const [discountFilter, setDiscountFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(() => {
    return today.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return today.toISOString().split("T")[0];
  });

  const fieldClass =
    "h-10 w-full rounded-lg border border-slate-200 dark:border-slate-500 bg-white dark:bg-slate-800 px-3 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-[#004aa3] dark:focus:border-sky-400 focus:ring-2 focus:ring-[#004aa3]/20 dark:focus:ring-sky-400/20";

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
        ...(endDate && { endDate }),
        ...(discountFilter && { discount_id: discountFilter })
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
    <>
      <div className="rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 p-4 shadow-sm mb-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 items-end">
          <div>
            <select
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              className={fieldClass}
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
              <div>
                <input
                  type="text"
                  placeholder="Slip ID"
                  value={slipId}
                  onChange={(e) => setSlipID(e.target.value)}
                  className={fieldClass}
                />
              </div>
              <div>
                <select
                  value={slipType}
                  onChange={(e) => setSlipType(e.target.value)}
                  className={fieldClass}
                >
                  <option value="">Select Type</option>
                  <option value="1">Appointment</option>
                  <option value="2">Pharmacy</option>
                </select>
              </div>
              <div>
                <select
                  value={discountFilter}
                  onChange={(e) => setDiscountFilter(e.target.value)}
                  className={fieldClass}
                >
                  <option value="">All Discounts</option>
                  {discounts?.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.discount_name} ({d.discount_percentage}%)
                    </option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            <div>
              <select
                value={user}
                onChange={(e) => setUser(e.target.value)}
                className={fieldClass}
              >
                <option value="">Select User</option>
                {allUsers?.map((u) => (
                  <option key={u?.id} value={u?.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setStartShareDate?.(e.target.value);
              }}
              className={fieldClass}
            />
          </div>
          <div>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setShareEndDate?.(e.target.value);
              }}
              className={fieldClass}
            />
          </div>
          <div className="lg:col-span-1">
            <button
              onClick={fetchFilteredSlips}
              disabled={loading}
              className="h-10 w-full flex rounded-lg border border-slate-200 dark:border-slate-600 bg-[#004aa3] dark:bg-sky-600 text-sm font-semibold text-white shadow-sm transition-colors items-center justify-center hover:bg-[#003d82] dark:hover:bg-sky-700 disabled:opacity-70"
            >
              {loading ? <BtnLoader /> : "Search"}
            </button>
          </div>
        </div>
        {showNo && (
          <button
            type="button"
            onClick={() => setShowNo(false)}
            className="mt-3 text-sm font-medium text-[#004aa3] hover:underline"
          >
            Clear filter
          </button>
        )}
      </div>
    </>
  );
}

export default SearchSlip;
