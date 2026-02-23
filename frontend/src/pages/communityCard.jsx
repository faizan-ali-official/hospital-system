import React, { useRef, useState, useEffect } from "react";
import DeleteModal from "../components/communityCard/deleteModal";
import { useMainContext } from "../context/mainContext";
import { toast } from "react-toastify";
import { axiosClient } from "../utils/AxiosClient";
import { HiMagnifyingGlass, HiOutlinePrinter } from "react-icons/hi2";
import { FaFilter, FaTimes, FaEllipsisV } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import MemberDetailModal from "../components/communityCard/memberDetailCard";

const CommunityCard = () => {
  const navigate = useNavigate();
  const tableContainerRef = useRef(null);
  const { user, communityCard, setCommunityCard } = useMainContext();
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchCard, setSearchCard] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [showNo, setShowNo] = useState(false);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [actionMenuId, setActionMenuId] = useState(null);

  const Icon = showFilter ? FaTimes : FaFilter;

  useEffect(() => {
    const closeMenu = () => setActionMenuId(null);
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, []);

  const limit = 100;

  const fetchSlips = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const response = await axiosClient.get(
        `/api/community-cards?limit=${limit}&offset=${offset}&deleted=true`
      );
      const newSlips = response?.data;
      setCommunityCard((prevSlips) => {
        const merged = [...prevSlips, ...newSlips];
        return [...new Map(merged.map((item) => [item.id, item])).values()];
      });
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
      await axiosClient.delete(`/api/community-cards/${selectedUser?.id}`);
      const deletedCard = communityCard.filter(
        (user) => user?.id !== selectedUser?.id
      );
      setCommunityCard(deletedCard);
      setSelectedUser(null);
      toast.success("Card deleted successfully!");
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message);
    }
  };

  const filteredCommunityCards = communityCard.filter((item) => {
    if (!searchCard.trim()) return true;
    const search = searchCard.toLowerCase();
    const mainMatch =
      item?.full_name?.toLowerCase().includes(search) ||
      item?.cnic?.includes(search);
    const relationMatch = item?.relations?.some((rel) => {
      return (
        rel?.full_name?.toLowerCase().includes(search) ||
        rel?.cnic?.includes(search)
      );
    });
    return mainMatch || relationMatch;
  });

  const handlePrint = () => {
    if (!tableContainerRef?.current) return;
    const clonedTable = tableContainerRef.current.cloneNode(true);
    const table = clonedTable.querySelector("table");
    if (!table) return;
    const rows = table.querySelectorAll("tr");
    const headerCells = rows[0]?.querySelectorAll("th") ?? [];
    let actionsIndex = -1;
    headerCells.forEach((th, index) => {
      if (th.innerText.toLowerCase().includes("action")) actionsIndex = index;
    });
    rows.forEach((row, rowIndex) => {
      if (rowIndex === 0) return;
      const cells = row.querySelectorAll("td");
      if (actionsIndex !== -1 && cells[actionsIndex])
        cells[actionsIndex].remove();
    });
    if (actionsIndex !== -1 && rows[0]) {
      const ths = rows[0].querySelectorAll("th");
      if (ths[actionsIndex]) ths[actionsIndex].remove();
    }
    const printWindow = window.open("", "", "width=1000,height=800");
    printWindow.document.write(`
      <html>
        <head>
          <title>Community Cards</title>
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            h2 { text-align: center; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th, td { border: 1px solid #004aa3; padding: 8px; text-align: left; }
            th { background-color: #f3f4f6; -webkit-print-color-adjust: exact; }
            tr { page-break-inside: avoid; }
          </style>
        </head>
        <body>
          <h2>Malik Medical Health Center - Community Cards</h2>
          ${clonedTable.innerHTML}
          <script>window.onload = function () { window.print(); };<\/script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="flex justify-center min-h-0 flex-1">
      <div className="w-full xl:w-[95%] flex flex-col overflow-hidden">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">
          Community Card
        </h2>

        {/* Control bar - same as Patient Slips */}
        <div className="flex  mb-4 justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by name or CNIC"
                value={searchCard}
                onChange={(e) => setSearchCard(e.target.value)}
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
              onClick={handlePrint}
              className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
            >
              <HiOutlinePrinter className="w-4 h-4" />
              Print
            </button>
          </div>
          {user?.role === "admin" && (
            <button
              type="button"
              onClick={() => navigate("/communitycardcreate")}
              className="flex h-10 items-center gap-2 rounded-lg bg-[#004aa3] px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#003d8a]"
            >
              + Card
            </button>
          )}
        </div>

        {showFilter && (
          <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-600">
            No filters available for community cards yet.
          </div>
        )}

        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-semibold text-slate-800">Records</h3>
        </div>
        <div
          ref={tableContainerRef}
          className={`overflow-y-auto flex-1 min-h-0 rounded-xl border border-slate-200 bg-white ${
            showFilter
              ? "max-h-[calc(100vh-420px)]"
              : "max-h-[calc(100vh-220px)]"
          }`}
        >
          {!showNo ? (
            filteredCommunityCards.length > 0 ? (
              <table className="w-full">
                <thead className="sticky top-0 z-10 bg-white border-b border-slate-200">
                  <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                    <th className="py-3 px-4">Card ID</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">CNIC</th>
                    <th className="py-3 px-4">Card No</th>
                    <th className="py-3 px-4">Contact Number</th>
                    <th className="py-3 px-4 text-right print-hidden">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCommunityCards.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-slate-100 text-sm text-slate-800 hover:bg-slate-50/80 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedMember(item);
                        setShowDetailModal(true);
                      }}
                    >
                      <td className="py-3 px-4 font-medium">{item?.id}</td>
                      <td className="py-3 px-4 capitalize">
                        {item?.full_name}
                      </td>
                      <td className="py-3 px-4">{item?.cnic}</td>
                      <td className="py-3 px-4">
                        {item?.card_number || "N/A"}
                      </td>
                      <td className="py-3 px-4">{item?.contact_number}</td>
                      <td
                        className="py-3 px-4 text-right print-hidden"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="relative inline-block">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActionMenuId(
                                actionMenuId === item.id ? null : item.id
                              );
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
                                  setSelectedMember(item);
                                  setShowDetailModal(true);
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
                                      navigate("/communitycardcreate", {
                                        state: { data: item }
                                      });
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
                                      setShowDetailModal(false);
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
              <p className="text-center font-semibold text-slate-600">
                No data found for this filter.
              </p>
            </div>
          )}
          {loading && (
            <div className="flex justify-center py-4 text-sm text-slate-500">
              Loading more...
            </div>
          )}
          {!hasMore && filteredCommunityCards.length > 0 && (
            <div className="flex justify-center py-3 text-xs text-slate-400">
              End of records
            </div>
          )}
        </div>
      </div>
      {showDetailModal && (
        <MemberDetailModal
          data={selectedMember}
          onClose={() => {
            setSelectedMember(null);
            setShowDetailModal(false);
          }}
        />
      )}

      {showModal && (
        <DeleteModal
          title="Confirm Deletion"
          message={`Are you sure you want to delete ?`}
          onCancel={() => {
            setSelectedUser(null);
            setShowModal(false);
          }}
          onConfirm={() => {
            onDelete();
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
};

export default CommunityCard;
