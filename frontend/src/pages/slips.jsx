import React, { useRef, useState, useEffect } from "react";
import UserUpdateModal from "../components/slips/updateModal";
import DeleteModal from "../components/slips/deleteModal";
import { useMainContext } from "../context/mainContext";
import SearchSlip from "../components/searchSlip";
import PrintSlip from "../components/slips/printSlips";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";
import { axiosClient } from "../utils/AxiosClient";
import { FaFilter, FaTimes } from "react-icons/fa";

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

  const Icon = showFilter ? FaTimes : FaFilter;

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
    <div className="flex justify-center h-[calc(89vh - 33px)]">
      <div className="w-full xl:w-[90%] flex flex-col overflow-hidden">
        <div className="flex justify-between items-center ">
          <h2 className="text-xl font-bold">Patient Slips</h2>
          <Icon
            size={25}
            onClick={() => setShowFilter(!showFilter)}
            className="text-[#004aa3] cursor-pointer"
          />
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
        <div
          ref={tableContainerRef}
          className={`overflow-y-auto ${
            showFilter ? "max-h-[calc(89vh-350px)]" : "max-h-[calc(89vh-80px)]"
          } mt-4`}
        >
          {!showNo ? (
            allSlips ? (
              <table className="w-full rounded">
                <thead className="sticky top-0 bg-gray-100 z-10">
                  <tr className="text-left text-sm uppercase text-gray-600">
                    <th className="py-3 px-6 border border-[#004aa3]">
                      Slip ID
                    </th>
                    <th className="py-3 px-6 border border-[#004aa3]">
                      Patient Name
                    </th>
                    <th className="py-3 px-6 border border-[#004aa3]">
                      Doctor
                    </th>
                    <th className="py-3 px-6 border border-[#004aa3]">
                      Slip Type
                    </th>
                    <th className="py-3 px-6 border border-[#004aa3]">Date</th>
                    <th className="py-3 px-6 border border-[#004aa3]">
                      Created By
                    </th>
                    <th className="py-3 px-6 border border-[#004aa3]">Fees</th>
                    <th className="py-3 px-6 border border-[#004aa3]">
                      Discount Fees
                    </th>
                    <th className="py-3 px-6 border border-[#004aa3] text-center print-hidden">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allSlips.slice().map((item) => (
                    <tr key={item.id} className="text-sm hover:bg-gray-50">
                      <td className="py-3 px-6 border border-[#004aa3]">
                        {item?.id}
                      </td>
                      <td className="py-3 px-6 border border-[#004aa3] capitalize">
                        {item?.patient_name}
                      </td>
                      <td className="py-3 px-6 border border-[#004aa3] capitalize">
                        {item?.doctor_name}
                      </td>
                      <td className="py-3 px-6 border border-[#004aa3] capitalize">
                        {item?.slip_type_name || item?.type_name}
                      </td>
                      <td className="py-3 px-6 border border-[#004aa3] capitalize">
                        {new Date(item.created_at)
                          .toLocaleDateString("en-GB")
                          .replace(/\//g, "-")}
                      </td>
                      <td className="py-3 px-6 border border-[#004aa3] capitalize">
                        {item?.created_by_name}
                      </td>
                      <td className="py-3 px-6 border border-[#004aa3]">
                        {item?.fees_before_discount != null
                          ? item.fees_before_discount
                          : item?.slip_type_name === "pharmacy"
                          ? Number(item?.pharmacy_fees) +
                            (Array.isArray(item?.services)
                              ? item.services.reduce(
                                  (sum, s) => sum + Number(s.fees || 0),
                                  0
                                )
                              : 0)
                          : item?.doctor_fee}
                      </td>
                      <td className="py-3 px-6 border border-[#004aa3]">
                        {item?.discount_id ? (
                          <span className="text-black font-medium">
                            {item.fees_after_discount}{" "}
                            <span className="text-gray-500 text-xs">
                              ({item.discount_name} - {item.discount_percentage}
                              %)
                            </span>
                          </span>
                        ) : (
                          <span className="text-gray-400">No Discount</span>
                        )}
                      </td>
                      <td className="py-3 px-6 border border-[#004aa3] text-center print-hidden">
                        <button
                          onClick={() => {
                            setGeneratedSlip(item);
                            setTimeout(() => {
                              printFn();
                            }, 1000);
                          }}
                          className="bg-[#004aa3] text-white px-3 py-1 rounded mr-1 "
                        >
                          View
                        </button>
                        {user?.role === "admin" && (
                          <>
                            <button
                              onClick={() => {
                                setSelectedUser(item);
                                setShowUpdateModal(true);
                              }}
                              className="bg-[#004aa3] text-white px-3 py-1 rounded mr-1 mt-1"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                setSelectedUser(item);
                                setShowModal(true);
                              }}
                              className="bg-[#004aa3] text-white px-3 py-1 rounded mr-1 mt-1"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="min-h-[400px] flex items-center justify-center text-gray-500 text-lg">
                No data found
              </div>
            )
          ) : (
            <div className="h-[40vh] flex items-center justify-center">
              <p className="text-center font-bold text-xl text-[#004aa3]">
                No Data Found
              </p>
            </div>
          )}
          {loading && (
            <div className="flex justify-center items-center text-[#004aa3] py-4 font-bold">
              Loading more data...
            </div>
          )}
          {!hasMore && (
            <div className="flex justify-center items-center py-4 text-[#004aa3] font-bold">
              End of records.
            </div>
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
