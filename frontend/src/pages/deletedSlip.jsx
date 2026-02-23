import React, { useState, useRef } from "react";
import { useMainContext } from "../context/mainContext";
import { HiMagnifyingGlass, HiOutlinePrinter } from "react-icons/hi2";
import { FaFilter, FaTimes } from "react-icons/fa";

const DeletedSlips = () => {
  const { deleteSlips } = useMainContext();
  const tableContainerRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  const Icon = showFilter ? FaTimes : FaFilter;

  const filteredSlips =
    deleteSlips?.filter((item) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const slipId = String(item?.id ?? "");
      const patient = (item?.patient_name ?? "").toLowerCase();
      const deletedBy = (item?.deleted_by_name ?? "").toLowerCase();
      const note = (item?.delete_note ?? "").toLowerCase();
      return (
        slipId.includes(q) ||
        patient.includes(q) ||
        deletedBy.includes(q) ||
        note.includes(q)
      );
    }) ?? [];

  const handlePrint = () => {
    if (!tableContainerRef?.current) return;
    const clonedTable = tableContainerRef.current.cloneNode(true);
    const printWindow = window.open("", "", "width=1000,height=800");
    printWindow.document.write(
      "<html><head><title>Deleted Slips</title><style>body{font-family:Arial,sans-serif;color:#333}h2{text-align:center;margin-bottom:20px}table{width:100%;border-collapse:collapse;font-size:12px}th,td{border:1px solid #004aa3;padding:8px;text-align:left}th{background-color:#f3f4f6}tr{page-break-inside:avoid}</style></head><body><h2>Malik Medical Health Center - Deleted Slips</h2>" +
        clonedTable.innerHTML +
        "<script>window.onload=function(){window.print();};</script></body></html>"
    );
    printWindow.document.close();
  };

  return (
    <div className="flex justify-center min-h-0 flex-1">
      <div className="w-full xl:w-[95%] flex flex-col overflow-hidden">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">
          Deleted Slips
        </h2>

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by slip ID, patient, deleted by or reason"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white py-0 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-[#004aa3] focus:ring-2 focus:ring-[#004aa3]/20"
            />
          </div>
        </div>
        {showFilter && (
          <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-600">
            No date filters for deleted slips yet.
          </div>
        )}

        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-semibold text-slate-800">Records</h3>
        </div>
        <div
          ref={tableContainerRef}
          className={
            "overflow-y-auto flex-1 min-h-0 rounded-xl border border-slate-200 bg-white " +
            (showFilter
              ? "max-h-[calc(100vh-420px)]"
              : "max-h-[calc(100vh-220px)]")
          }
        >
          {filteredSlips.length > 0 ? (
            <table className="w-full">
              <thead className="sticky top-0 z-10 bg-white border-b border-slate-200">
                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                  <th className="py-3 px-4">Slip ID</th>
                  <th className="py-3 px-4">Patient Name</th>
                  <th className="py-3 px-4">Deleted By</th>
                  <th className="py-3 px-4">Slip Type</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Delete Reason</th>
                </tr>
              </thead>
              <tbody>
                {filteredSlips.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-slate-100 text-sm text-slate-800 hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-3 px-4 font-medium">{item?.id}</td>
                    <td className="py-3 px-4 capitalize">
                      {item?.patient_name}
                    </td>
                    <td className="py-3 px-4 capitalize">
                      {item?.deleted_by_name}
                    </td>
                    <td className="py-3 px-4 capitalize">
                      {item?.slip_type_name}
                    </td>
                    <td className="py-3 px-4">
                      {item?.deleted_at
                        ? new Date(item.deleted_at)
                            .toLocaleDateString("en-GB")
                            .replace(/\//g, "-")
                        : ""}
                    </td>
                    <td className="py-3 px-4">{item?.delete_note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex min-h-[320px] items-center justify-center text-slate-500">
              No deleted slips found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeletedSlips;
