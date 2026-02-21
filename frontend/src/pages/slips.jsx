import React, { useRef, useState, useEffect } from "react";
import UserUpdateModal from "../components/slips/updateModal";
import DeleteModal from "../components/slips/deleteModal";
import { useMainContext } from "../context/mainContext";
import SearchSlip from "../components/searchSlip";
import PrintSlip from "../components/slips/printSlips";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";
import { axiosClient } from "../utils/AxiosClient";
import { HiMagnifyingGlass, HiOutlinePrinter } from "react-icons/hi2";
import { FaFilter, FaTimes, FaEllipsisV } from "react-icons/fa";

const Slips = () => {
  const componentRef = useRef(null);
  const tableContainerRef = useRef(null);
  const { allSlips, user, setDeleteSlips, today, deleteSlips, setAllSlips } =
    useMainContext();
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [generatedSlip, setGeneratedSlip] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [showNo, setShowNo] = useState(false);
  const [reasonSlip, setReasonSlip] = useState("");
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [startShareDate, setStartShareDate] = useState(() => {
    return today.toISOString().split("T")[0];
  });
  const [endShareDate, setShareEndDate] = useState(() => {
    return today.toISOString().split("T")[0];
  });

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [actionMenuId, setActionMenuId] = useState(null);
  const Icon = showFilter ? FaTimes : FaFilter;

  const filteredBySearch = allSlips?.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const slipId = String(item?.id ?? "");
    const patientName = (item?.patient_name ?? "").toLowerCase();
    return slipId.includes(q) || patientName.includes(q);
  }) ?? [];

  useEffect(() => {
    const closeMenu = () => setActionMenuId(null);
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, []);

  const printFn = useReactToPrint({
    documentTitle: `Patient Slip ${generatedSlip?.id}`,
    contentRef: componentRef,
    copyStyles: true,
    pageStyle: `
      @page {
        size: 80mm auto;
        margin: 0;
      }
      @media print {
        html {
          width: 80mm !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        body {
          width: 80mm !important;
          max-width: 80mm !important;
          margin: 0 !important;
          padding: 3mm !important;
          font-family: 'Courier New', monospace;
          font-size: 10px;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          box-sizing: border-box !important;
        }
        * {
          box-sizing: border-box !important;
          max-width: 100% !important;
        }
        .no-print {
          display: none !important;
        }
        /* Ensure tables and content fit */
        table {
          width: 100% !important;
          table-layout: fixed !important;
          border-collapse: collapse !important;
        }
        td, th {
          word-wrap: break-word !important;
          overflow-wrap: break-word !important;
          padding: 1mm !important;
        }
        /* Prevent text overflow */
        p, div, span {
          word-wrap: break-word !important;
          overflow-wrap: break-word !important;
        }
      }
    `
  });

  const handlePrint = () => {
    if (!tableContainerRef?.current) return;

    const clonedTable = tableContainerRef.current.cloneNode(true);
    const table = clonedTable.querySelector("table");
    if (!table) return;

    const rows = table.querySelectorAll("tr");

    let createdByIndex = -1;
    let actionsIndex = -1;
    let feeIndex = -1;
    let totalFees = 0;

    const headerCells = rows[0].querySelectorAll("th");

    headerCells.forEach((th, index) => {
      const text = th.innerText.toLowerCase();

      if (text.includes("created")) createdByIndex = index;
      if (text.includes("action")) actionsIndex = index;
      if (text.includes("fee")) feeIndex = index;
    });

    const srTh = document.createElement("th");
    srTh.innerText = "Sr No";
    rows[0].insertBefore(srTh, rows[0].children[0]);

    rows.forEach((row, rowIndex) => {
      if (rowIndex === 0) return;

      const cells = row.querySelectorAll("td");

      const srTd = document.createElement("td");
      srTd.innerText = rowIndex;
      row.insertBefore(srTd, row.children[0]);

      if (feeIndex !== -1 && cells[feeIndex]) {
        totalFees = allSlips.reduce((sum, item) => {
          let baseFee = 0;

          if (item?.fees_before_discount != null) {
            baseFee = Number(item.fees_before_discount);
          } else if (item?.slip_type_name === "pharmacy") {
            const pharmacyFee = Number(item?.pharmacy_fees || 0);
            const servicesFee = Array.isArray(item?.services)
              ? item.services.reduce(
                  (sSum, s) => sSum + Number(s?.fees || 0),
                  0
                )
              : 0;
            baseFee = pharmacyFee + servicesFee;
          } else {
            baseFee = Number(item?.doctor_fee || 0);
          }
          const discountPercent = Number(item?.discount_percentage || 0);
          const discountedAmount = baseFee - baseFee * (discountPercent / 100);
          return sum + discountedAmount;
        }, 0);
      }

      if (createdByIndex !== -1 && cells[createdByIndex]) {
        cells[createdByIndex].remove();
      }

      if (actionsIndex !== -1 && cells[actionsIndex]) {
        cells[actionsIndex].remove();
      }
    });

    if (createdByIndex !== -1) headerCells[createdByIndex]?.remove();
    if (actionsIndex !== -1) headerCells[actionsIndex]?.remove();

    if (feeIndex !== -1) {
      const totalRow = document.createElement("tr");

      const labelTd = document.createElement("td");
      labelTd.colSpan = feeIndex;
      labelTd.style.fontWeight = "bold";
      labelTd.innerText = "Total Fees";

      const valueTd = document.createElement("td");
      valueTd.style.fontWeight = "bold";
      valueTd.innerText = `Rs. ${totalFees}`;

      totalRow.appendChild(labelTd);
      totalRow.appendChild(valueTd);

      table.appendChild(totalRow);
    }

    const printWindow = window.open("", "", "width=1000,height=800");

    printWindow.document.write(`
      <html>
        <head>
          <title>Patient Records</title>
          <style>
            @page {
              size: A4;
              margin: 15mm;
            }
  
            body {
              font-family: Arial, sans-serif;
              color: #333;
            }
  
            h2 {
              text-align: center;
              text-decoration: underline;
              margin-bottom: 20px;
            }
  
            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 12px;
            }
  
            th, td {
              border: 1px solid #004aa3;
              padding: 8px;
              text-align: left;
            }
  
            th {
              background-color: #f3f4f6;
              -webkit-print-color-adjust: exact;
            }
  
            tr {
              page-break-inside: avoid;
            }

            .date-range { font-size: 1.1em; color: #555; margin-bottom: 10px;text-align:center }
          </style>
        </head>
        <body>
          <h2>Malik Medical Health Center</h2>
          <div class="date-range">
          <strong>Report Period: </strong> ${formatDate(
            startShareDate
          )} <strong>to</strong> ${formatDate(endShareDate)}
          </div>
          ${clonedTable.innerHTML}
          <script>
            window.onload = function () {
              window.print();
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  const limit = 100;

  const fetchSlips = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const response = await axiosClient.get(
        `/api/patient-slips?limit=${limit}&offset=${offset}&deleted=false`
      );
      const newSlips = response?.data;
      setAllSlips((prevSlips) => [...prevSlips, ...newSlips]);
      setOffset((prevOffset) => prevOffset + limit);
      if (newSlips.length < limit) {
        setHasMore(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch more slips.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        tableContainerRef.current;
      if (
        scrollHeight - scrollTop <= clientHeight + 50 &&
        !loading &&
        hasMore
      ) {
        fetchSlips();
      }
    };

    const container = tableContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [loading, hasMore]);

  const onDelete = async () => {
    try {
      await axiosClient.delete(`/api/patient-slips/${selectedUser?.id}`, {
        data: {
          delete_note: reasonSlip
        }
      });
      const deletedSlips = allSlips.filter(
        (user) => user?.id !== selectedUser?.id
      );
      const deletedSlip = allSlips.find(
        (user) => user?.id === selectedUser?.id
      );
      setAllSlips(deletedSlips);
      setDeleteSlips([
        ...deleteSlips,
        {
          ...deletedSlip,
          delete_note: reasonSlip,
          deleted_by_name: user.name || user.username
        }
      ]);
      setSelectedUser(null);
      toast.success("Slip deleted successfully!");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex justify-center min-h-0 flex-1">
      <div className="w-full xl:w-[95%] flex flex-col overflow-hidden">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Patient Slips</h2>

        {/* Control bar */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by Slip ID or Patient name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white py-0 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-[#004aa3] focus:ring-2 focus:ring-[#004aa3]/20"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilter(!showFilter)}
            className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
          >
            <Icon className="w-4 h-4 text-slate-500" />
            Filter
          </button>
          <button
            type="button"
            onClick={() => handlePrint()}
            className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
          >
            <HiOutlinePrinter className="w-4 h-4" />
            Print
          </button>
        </div>

        {showFilter && (
          <SearchSlip
            setFilteredSearch={setAllSlips}
            setShowNo={setShowNo}
            showNo={showNo}
            handlePrint={handlePrint}
            startShareDate={startShareDate}
            setStartShareDate={setStartShareDate}
            endShareDate={endShareDate}
            setShareEndDate={setShareEndDate}
          />
        )}

        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-semibold text-slate-800">Records</h3>
        </div>
        <div
          ref={tableContainerRef}
          className={`overflow-y-auto flex-1 min-h-0 rounded-xl border border-slate-200 bg-white ${
            showFilter ? "max-h-[calc(100vh-420px)]" : "max-h-[calc(100vh-220px)]"
          }`}
        >
          {!showNo ? (
            filteredBySearch.length > 0 ? (
              <table className="w-full">
                <thead className="sticky top-0 z-10 bg-white border-b border-slate-200">
                  <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                    <th className="py-3 px-4">Slip ID</th>
                    <th className="py-3 px-4">Patient Name</th>
                    <th className="py-3 px-4">Doctor</th>
                    <th className="py-3 px-4">Slip Type</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Created By</th>
                    <th className="py-3 px-4">Fees</th>
                    <th className="py-3 px-4">Discount Fees</th>
                    <th className="py-3 px-4 text-right print-hidden">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBySearch.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-slate-100 text-sm text-slate-800 hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium">{item?.id}</td>
                      <td className="py-3 px-4 capitalize">{item?.patient_name}</td>
                      <td className="py-3 px-4 capitalize">{item?.doctor_name}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            (item?.slip_type_name || item?.type_name) === "pharmacy"
                              ? "bg-sky-100 text-sky-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {item?.slip_type_name || item?.type_name || "—"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {new Date(item.created_at).toLocaleDateString("en-GB").replace(/\//g, "-")}
                      </td>
                      <td className="py-3 px-4 capitalize">{item?.created_by_name}</td>
                      <td className="py-3 px-4">
                        {item?.fees_before_discount != null
                          ? item.fees_before_discount
                          : item?.slip_type_name === "pharmacy"
                          ? Number(item?.pharmacy_fees) +
                            (Array.isArray(item?.services)
                              ? item.services.reduce((sum, s) => sum + Number(s.fees || 0), 0)
                              : 0)
                          : item?.doctor_fee}
                      </td>
                      <td className="py-3 px-4">
                        {item?.discount_id ? (
                          <span className="text-slate-700">
                            {item.fees_after_discount}{" "}
                            <span className="text-slate-400 text-xs">
                              ({item.discount_name} - {item.discount_percentage}%)
                            </span>
                          </span>
                        ) : (
                          <span className="text-slate-400">No Discount</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right print-hidden">
                        <div className="relative inline-block">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActionMenuId(actionMenuId === item.id ? null : item.id);
                            }}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                            aria-label="Actions"
                          >
                            <FaEllipsisV className="w-4 h-4" />
                          </button>
                          {actionMenuId === item.id && (
                            <div
                              className="absolute right-0 top-full z-20 mt-1 w-40 rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  setGeneratedSlip(item);
                                  setTimeout(() => printFn(), 1000);
                                  setActionMenuId(null);
                                }}
                                className="block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                              >
                                View
                              </button>
                              {user?.role === "admin" && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedUser(item);
                                      setShowUpdateModal(true);
                                      setActionMenuId(null);
                                    }}
                                    className="block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedUser(item);
                                      setShowModal(true);
                                      setActionMenuId(null);
                                    }}
                                    className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                                  >
                                    Delete
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex min-h-[320px] items-center justify-center text-slate-500">
                No data found
              </div>
            )
          ) : (
            <div className="flex min-h-[320px] items-center justify-center">
              <p className="text-center font-semibold text-slate-600">No data found for this filter.</p>
            </div>
          )}
          {loading && (
            <div className="flex justify-center py-4 text-sm text-slate-500">Loading more...</div>
          )}
          {!hasMore && filteredBySearch.length > 0 && (
            <div className="flex justify-center py-3 text-xs text-slate-400">End of records</div>
          )}
        </div>
      </div>
      {showUpdateModal && (
        <UserUpdateModal
          user={selectedUser}
          onClose={() => setShowUpdateModal(false)}
          setShowUpdateModal={setShowUpdateModal}
        />
      )}
      {showModal && (
        <DeleteModal
          title="Confirm Deletion"
          message="Are you sure you want to delete?"
          onCancel={() => {
            setSelectedUser(null);
            setShowModal(false);
          }}
          onConfirm={() => {
            onDelete();
            setShowModal(false);
          }}
          reasonSlip={reasonSlip}
          setReasonSlip={setReasonSlip}
        />
      )}
      {generatedSlip && (
        <>
          <div className=" absolute left-[-9999px]">
            <PrintSlip ref={componentRef} user={generatedSlip} />
          </div>
        </>
      )}
    </div>
  );
};

export default Slips;
