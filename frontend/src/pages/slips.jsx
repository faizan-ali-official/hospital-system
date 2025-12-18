// import React, { useRef, useState, useEffect } from "react";
// import UserUpdateModal from "../components/slips/updateModal";
// import DeleteModal from "../components/slips/deleteModal";
// import { useMainContext } from "../context/mainContext";
// import SearchSlip from "../components/searchSlip";
// import PrintSlip from "../components/slips/printSlips";
// import { useReactToPrint } from "react-to-print";
// import { toast } from "react-toastify";
// import { axiosClient } from "../utils/AxiosClient";
// import { FaFilter, FaTimes } from "react-icons/fa";

// const Slips = () => {
//   const componentRef = useRef(null);
//   const tableContainerRef = useRef(null);
//   const { allSlips, user, setDeleteSlips, deleteSlips, setAllSlips } =
//     useMainContext();
//   const [showModal, setShowModal] = useState(false);
//   const [showUpdateModal, setShowUpdateModal] = useState(false);
//   const [generatedSlip, setGeneratedSlip] = useState(null);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [showFilter, setShowFilter] = useState(false);
//   const [showNo, setShowNo] = useState(false);
//   const [reasonSlip, setReasonSlip] = useState("");
//   const [offset, setOffset] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [hasMore, setHasMore] = useState(true);

//   const Icon = showFilter ? FaTimes : FaFilter;

//   const printFn = useReactToPrint({
//     documentTitle: `Pateint Slip ${generatedSlip?.id}`,
//     contentRef: componentRef,
//     copyStyles: true,
//     pageStyle: `
//     @page {
//       size: 80mm auto;
//       margin: 0;
//     }
//     @media print {
//       html, body {
//         width: 80mm;
//         margin: 0;
//         padding: 0;
//         font-family: 'Courier New', monospace;
//         font-size: 11px;
//         -webkit-print-color-adjust: exact !important;
//         print-color-adjust: exact !important;
//       }
//       * {
//         box-sizing: border-box;
//       }
//       .no-print {
//         display: none !important;
//       }
//     }
//   `
//   });

//   const limit = 100;

//   const fetchSlips = async () => {
//     if (loading || !hasMore) return;
//     setLoading(true);
//     try {
//       const response = await axiosClient.get(
//         `/api/patient-slips?limit=${limit}&offset=${offset}&deleted=true`
//       );
//       const newSlips = response?.data;
//       setAllSlips((prevSlips) => [...prevSlips, ...newSlips]);
//       setOffset((prevOffset) => prevOffset + limit);
//       if (newSlips.length < limit) {
//         setHasMore(false);
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to fetch more slips.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const handleScroll = () => {
//       const { scrollTop, scrollHeight, clientHeight } =
//         tableContainerRef.current;
//       if (
//         scrollHeight - scrollTop <= clientHeight + 50 &&
//         !loading &&
//         hasMore
//       ) {
//         fetchSlips();
//       }
//     };

//     const container = tableContainerRef.current;
//     if (container) {
//       container.addEventListener("scroll", handleScroll);
//     }

//     return () => {
//       if (container) {
//         container.removeEventListener("scroll", handleScroll);
//       }
//     };
//   }, [loading, hasMore]);

//   const onDelete = async () => {
//     try {
//       await axiosClient.delete(`/api/patient-slips/${selectedUser?.id}`, {
//         data: {
//           delete_note: reasonSlip
//         }
//       });
//       const deletedSlips = allSlips.filter(
//         (user) => user?.id !== selectedUser?.id
//       );
//       const deletedSlip = allSlips.find(
//         (user) => user?.id === selectedUser?.id
//       );
//       setAllSlips(deletedSlips);
//       setDeleteSlips([
//         ...deleteSlips,
//         {
//           ...deletedSlip,
//           delete_note: reasonSlip,
//           deleted_by_name: user.name || user.username
//         }
//       ]);
//       setSelectedUser(null);
//       toast.success("Slip deleted successfully!");
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   return (
//     <div className="flex justify-center h-[calc(89vh - 33px)]">
//       <div className="w-full xl:w-[90%] flex flex-col overflow-hidden">
//         <div className="flex justify-between items-center ">
//           <h2 className="text-xl font-bold">Patient Slips</h2>
//           <Icon
//             size={25}
//             onClick={() => setShowFilter(!showFilter)}
//             className="text-[#004aa3] cursor-pointer"
//           />
//         </div>
//         {showFilter && (
//           <SearchSlip
//             setFilteredSearch={setAllSlips}
//             setShowNo={setShowNo}
//             showNo={showNo}
//           />
//         )}
//         <div
//           ref={tableContainerRef}
//           className={`overflow-y-auto ${
//             showFilter ? "max-h-[calc(89vh-350px)]" : "max-h-[calc(89vh-80px)]"
//           } mt-4`}
//         >
//           {!showNo ? (
//             allSlips ? (
//               <table className="w-full rounded">
//                 <thead className="sticky top-0 bg-gray-100 z-10">
//                   <tr className="text-left text-sm uppercase text-gray-600">
//                     <th className="py-3 px-6 border border-[#004aa3]">
//                       Slip ID
//                     </th>
//                     <th className="py-3 px-6 border border-[#004aa3]">
//                       Patient Name
//                     </th>
//                     <th className="py-3 px-6 border border-[#004aa3]">
//                       Doctor
//                     </th>
//                     <th className="py-3 px-6 border border-[#004aa3]">
//                       Slip Type
//                     </th>
//                     <th className="py-3 px-6 border border-[#004aa3]">Date</th>
//                     <th className="py-3 px-6 border border-[#004aa3]">
//                       Created By
//                     </th>
//                     <th className="py-3 px-6 border border-[#004aa3]">Fees</th>
//                     <th className="py-3 px-6 border border-[#004aa3] text-center">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {allSlips
//                     .slice()
//                     .sort((a, b) => b.id - a.id)
//                     .map((item) => (
//                       <tr key={item.id} className="text-sm hover:bg-gray-50">
//                         <td className="py-3 px-6 border border-[#004aa3]">
//                           {item?.id}
//                         </td>
//                         <td className="py-3 px-6 border border-[#004aa3] capitalize">
//                           {item?.patient_name}
//                         </td>
//                         <td className="py-3 px-6 border border-[#004aa3] capitalize">
//                           {item?.doctor_name}
//                         </td>
//                         <td className="py-3 px-6 border border-[#004aa3] capitalize">
//                           {item?.slip_type_name || item?.type_name}
//                         </td>
//                         <td className="py-3 px-6 border border-[#004aa3] capitalize">
//                           {new Date(item.created_at)
//                             .toLocaleDateString("en-GB")
//                             .replace(/\//g, "-")}
//                         </td>
//                         <td className="py-3 px-6 border border-[#004aa3] capitalize">
//                           {item?.created_by_name}
//                         </td>
//                         <td className="py-3 px-6 border border-[#004aa3]">
//                           {item?.slip_type_name === "pharmacy"
//                             ? Number(item?.pharmacy_fees) +
//                               (Array.isArray(item?.services)
//                                 ? item.services.reduce(
//                                     (sum, s) => sum + Number(s.fees || 0),
//                                     0
//                                   )
//                                 : 0)
//                             : item?.doctor_fee}
//                         </td>
//                         <td className="py-3 px-6 border border-[#004aa3] text-center">
//                           <button
//                             onClick={() => {
//                               setGeneratedSlip(item);
//                               setTimeout(() => {
//                                 printFn();
//                               }, 1000);
//                             }}
//                             className="bg-[#004aa3] text-white px-3 py-1 rounded mr-1 "
//                           >
//                             View
//                           </button>
//                           {user?.role === "admin" && (
//                             <>
//                               <button
//                                 onClick={() => {
//                                   setSelectedUser(item);
//                                   setShowUpdateModal(true);
//                                 }}
//                                 className="bg-[#004aa3] text-white px-3 py-1 rounded mr-1 mt-1"
//                               >
//                                 Edit
//                               </button>
//                               <button
//                                 onClick={() => {
//                                   setSelectedUser(item);
//                                   setShowModal(true);
//                                 }}
//                                 className="bg-[#004aa3] text-white px-3 py-1 rounded mr-1 mt-1"
//                               >
//                                 Delete
//                               </button>
//                             </>
//                           )}
//                         </td>
//                       </tr>
//                     ))}
//                 </tbody>
//               </table>
//             ) : (
//               <div className="min-h-[400px] flex items-center justify-center text-gray-500 text-lg">
//                 No data found
//               </div>
//             )
//           ) : (
//             <div className="h-[40vh] flex items-center justify-center">
//               <p className="text-center font-bold text-xl text-[#004aa3]">
//                 No Data Found
//               </p>
//             </div>
//           )}
//           {loading && (
//             <div className="flex justify-center items-center text-[#004aa3] py-4 font-bold">
//               Loading more data...
//             </div>
//           )}
//           {!hasMore && (
//             <div className="flex justify-center items-center py-4 text-[#004aa3] font-bold">
//               End of records.
//             </div>
//           )}
//         </div>
//       </div>
//       {showUpdateModal && (
//         <UserUpdateModal
//           user={selectedUser}
//           onClose={() => setShowUpdateModal(false)}
//           setShowUpdateModal={setShowUpdateModal}
//         />
//       )}
//       {showModal && (
//         <DeleteModal
//           title="Confirm Deletion"
//           message="Are you sure you want to delete?"
//           onCancel={() => {
//             setSelectedUser(null);
//             setShowModal(false);
//           }}
//           onConfirm={() => {
//             onDelete();
//             setShowModal(false);
//           }}
//           reasonSlip={reasonSlip}
//           setReasonSlip={setReasonSlip}
//         />
//       )}
//       {generatedSlip && (
//         <>
//           <div className=" absolute left-[-9999px]">
//             <PrintSlip ref={componentRef} user={generatedSlip} />
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Slips;

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
  const { allSlips, user, setDeleteSlips, deleteSlips, setAllSlips } =
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

  const limit = 100;

  const fetchSlips = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const response = await axiosClient.get(
        `/api/patient-slips?limit=${limit}&offset=${offset}&deleted=true`
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
                    <th className="py-3 px-6 border border-[#004aa3] text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allSlips
                    .slice()
                    .sort((a, b) => b.id - a.id)
                    .map((item) => (
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
                          {item?.slip_type_name === "pharmacy"
                            ? Number(item?.pharmacy_fees) +
                              (Array.isArray(item?.services)
                                ? item.services.reduce(
                                    (sum, s) => sum + Number(s.fees || 0),
                                    0
                                  )
                                : 0)
                            : item?.doctor_fee}
                        </td>
                        <td className="py-3 px-6 border border-[#004aa3] text-center">
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
