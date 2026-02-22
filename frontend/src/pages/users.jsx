import React, { useState, useEffect, useRef } from "react";
import { axiosClient } from "../utils/AxiosClient";
import DeleteModal from "../components/users/deleteModal";
import UserUpdateModal from "../components/users/updateModal";
import { useNavigate } from "react-router-dom";
import { useMainContext } from "../context/mainContext";
import { toast } from "react-toastify";
import { HiMagnifyingGlass, HiOutlinePrinter } from "react-icons/hi2";
import { FaFilter, FaTimes, FaEllipsisV } from "react-icons/fa";

const Users = () => {
  const navigate = useNavigate();
  const tableContainerRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const { allUsers, setAllUsers, user } = useMainContext();
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [actionMenuId, setActionMenuId] = useState(null);

  const Icon = showFilter ? FaTimes : FaFilter;

  useEffect(() => {
    const closeMenu = () => setActionMenuId(null);
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, []);

  const filteredUsers =
    allUsers?.filter((item) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const name = (item?.name || item?.username || "").toLowerCase();
      const email = (item?.email || "").toLowerCase();
      const role = (item?.role_name || "").toLowerCase();
      return name.includes(q) || email.includes(q) || role.includes(q);
    }) ?? [];

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
      if (actionsIndex !== -1 && cells[actionsIndex]) cells[actionsIndex].remove();
    });
    if (actionsIndex !== -1 && rows[0]) {
      const ths = rows[0].querySelectorAll("th");
      if (ths[actionsIndex]) ths[actionsIndex].remove();
    }
    const printWindow = window.open("", "", "width=1000,height=800");
    printWindow.document.write(`
      <html>
        <head>
          <title>Users</title>
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
          <h2>Malik Medical Health Center - Users</h2>
          ${clonedTable.innerHTML}
          <script>window.onload = function () { window.print(); };<\/script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const onDelete = async () => {
    if (selectedUser?.id !== user?.id) {
      try {
        await axiosClient.delete(`/api/user/${selectedUser?.id}`);
        const deletedUser = allUsers.filter((u) => u?.id !== selectedUser?.id);
        setAllUsers(deletedUser);
        setSelectedUser(null);
        toast.success("User deleted successfully!");
      } catch (err) {
        toast.error(err?.response?.data?.message || err?.message);
      }
    } else {
      toast.error("Cannot delete logged-in user");
    }
  };

  return (
    <div className="flex justify-center min-h-0 flex-1">
      <div className="w-full xl:w-[95%] flex flex-col overflow-hidden">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Users</h2>

        {/* Control bar */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, email or role"
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
            onClick={handlePrint}
            className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
          >
            <HiOutlinePrinter className="w-4 h-4" />
            Print
          </button>
          {user?.role === "admin" && (
            <button
              type="button"
              onClick={() => navigate("/usercreate")}
              className="flex h-10 items-center gap-2 rounded-lg bg-[#004aa3] px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#003d8a]"
            >
              + User
            </button>
          )}
        </div>

        {showFilter && (
          <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-600">
            No filters available for users yet.
          </div>
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
          {filteredUsers.length > 0 ? (
            <table className="w-full">
              <thead className="sticky top-0 z-10 bg-white border-b border-slate-200">
                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  {user?.role === "admin" && (
                    <th className="py-3 px-4 text-right print-hidden">Action</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((item) => (
                  <tr
                    key={item?.id}
                    className="border-b border-slate-100 text-sm text-slate-800 hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-3 px-4 font-medium capitalize">
                      {item?.name || item?.username}
                    </td>
                    <td className="py-3 px-4">{item?.email}</td>
                    <td className="py-3 px-4 capitalize">{item?.role_name}</td>
                    {user?.role === "admin" && (
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
                            </div>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex min-h-[320px] items-center justify-center text-slate-500">
              No users found
            </div>
          )}
        </div>
      </div>

      {showUpdateModal && selectedUser && (
        <UserUpdateModal
          user={selectedUser}
          onClose={() => {
            setSelectedUser(null);
            setShowUpdateModal(false);
          }}
          setShowUpdateModal={setShowUpdateModal}
        />
      )}
      {showModal && (
        <DeleteModal
          title="Confirm Deletion"
          message="Are you sure you want to delete this user?"
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

export default Users;
