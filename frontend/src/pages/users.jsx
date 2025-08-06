import React, { useState } from "react";
import { axiosClient } from "../utils/AxiosClient";
import DeleteModal from "../components/users/deleteModal";
import UserUpdateModal from "../components/users/updateModal";
import { useNavigate } from "react-router-dom";
import { useMainContext } from "../context/mainContext";
import { toast } from "react-toastify";

const Users = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const { allUsers, setAllUsers, user } = useMainContext();
  const [selectedUser, setSelectedUser] = useState(null);

  const onDelete = async () => {
    try {
      await axiosClient.delete(`/api/user/${selectedUser?.id}`);
      const deletedUser = allUsers.filter(
        (user) => user?.id !== selectedUser?.id
      );
      setAllUsers(deletedUser);
      setSelectedUser(null);
      toast.success("User deleted successfully!");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className=" justify-center">
      <div className="flex w-full xl:w-[90%] justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Users</h2>
        {user?.role === "admin" && (
          <button
            onClick={() => navigate("/usercreate")}
            className="bg-[#004aa3] text-white px-4 py-2 rounded shadow"
          >
            + User
          </button>
        )}
      </div>
      <table className="w-full xl:w-[90%] rounded">
        <thead>
          <tr className="bg-gray-100 text-left text-sm uppercase text-gray-600">
            <th className="py-3 px-6 border border-[#004aa3]">Name</th>
            <th className="py-3 px-6 border border-[#004aa3]">Email</th>
            <th className="py-3 px-6 border border-[#004aa3]">Role</th>
            <th className="py-3 px-6 border border-[#004aa3] text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {allUsers?.map((user) => (
            <tr key={user?.id} className="text-sm hover:bg-gray-50">
              <td className="py-3 px-6 border border-[#004aa3] capitalize">
                {user?.name}
              </td>
              <td className="py-3 px-6 border border-[#004aa3]">
                {user?.email}
              </td>
              <td className="py-3 px-6 border border-[#004aa3] capitalize">
                {user?.role_name}
              </td>
              <td className="py-3 px-6 border border-[#004aa3] text-center">
                <button
                  onClick={() => {
                    setSelectedUser(user);
                    setShowUpdateModal(true);
                  }}
                  className="bg-[#004aa3] text-white px-3 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setSelectedUser(user);
                    setShowModal(true);
                  }}
                  className="bg-[#004aa3] text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
              {showUpdateModal && (
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
