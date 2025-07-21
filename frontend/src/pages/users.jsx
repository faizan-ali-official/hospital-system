import React, { useEffect, useState } from "react";
import { axiosClient } from "../utils/AxiosClient";
import DeleteModal from "../components/users/deleteModal";
import UserUpdateModal from "../components/users/updateModal";
import { useNavigate } from "react-router-dom";
import { useMainContext } from "../context/mainContext";

const Users = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const { allUsers, setAllUsers } = useMainContext();

  const onDelete = async (id) => {
    try {
      await axiosClient.delete(`/api/user/${id}`);
      const deletedUser = allUsers.filter((user) => user?.id !== id);
      setAllUsers(deletedUser);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className=" justify-center">
      <div className="flex w-full xl:w-[90%] justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Users</h2>
        <button
          onClick={() => navigate("/usercreate")}
          className="bg-[#004aa3] text-white px-4 py-2 rounded shadow"
        >
          + User
        </button>
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
            <tr key={user.id} className="text-sm hover:bg-gray-50">
              <td className="py-3 px-6 border border-[#004aa3]">
                {user.name.replace(/\b\w/g, (char) => char.toUpperCase())}
              </td>
              <td className="py-3 px-6 border border-[#004aa3]">
                {user.email}
              </td>
              <td className="py-3 px-6 border border-[#004aa3]">
                {user.role_name.replace(/\b\w/g, (char) => char.toUpperCase())}
              </td>
              <td className="py-3 px-6 border border-[#004aa3] text-center">
                <button
                  onClick={() => setShowUpdateModal(true)}
                  className="bg-[#004aa3] text-white px-3 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-[#004aa3] text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
              {showUpdateModal && (
                <UserUpdateModal
                  user={user}
                  onClose={() => setShowUpdateModal(false)}
                  onUpdated={null}
                />
              )}
              {showModal && (
                <DeleteModal
                  title="Confirm Deletion"
                  message={`Are you sure you want to delete ?`}
                  onCancel={() => setShowModal(false)}
                  onConfirm={() => {
                    onDelete(user?.id);
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
