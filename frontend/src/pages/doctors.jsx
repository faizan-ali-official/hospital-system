import React, { useEffect, useState } from "react";
import { axiosClient } from "../utils/AxiosClient";
import DeleteModal from "../components/doctors/deleteModal";
import UserUpdateModal from "../components/doctors/updateModal";
import { useNavigate } from "react-router-dom";
import { useMainContext } from "../context/mainContext";
import { toast } from "react-toastify";

const Doctors = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const { doctors, setDoctors, user } = useMainContext();
  const [selectedUser, setSelectedUser] = useState(null);

  const onDelete = async () => {
    try {
      await axiosClient.delete(`/api/doctor/${selectedUser?.id}`);
      const deletedDocs = doctors.filter(
        (user) => user?.id !== selectedUser?.id
      );
      setDoctors(deletedDocs);
      setSelectedUser(null);
      toast.success("Doctor deleted successfully!");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className=" justify-center">
      <div className="flex w-full xl:w-[90%] justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Doctors</h2>
        {user?.role === "admin" && (
          <button
            onClick={() => navigate("/doctorcreate")}
            className="bg-[#004aa3] text-white px-4 py-2 rounded shadow"
          >
            + Doctor
          </button>
        )}
      </div>
      <table className="w-full xl:w-[90%] rounded">
        <thead>
          <tr className="bg-gray-100 text-left text-sm uppercase text-gray-600">
            <th className="py-3 px-6 border border-[#004aa3]">Name</th>
            <th className="py-3 px-6 border border-[#004aa3]">
              Specialization
            </th>
            <th className="py-3 px-6 border border-[#004aa3] text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {doctors?.map((user) => (
            <tr key={user.id} className="text-sm hover:bg-gray-50">
              <td className="py-3 px-6 border border-[#004aa3]">
                {user.doctor_name.replace(/\b\w/g, (char) =>
                  char.toUpperCase()
                )}
              </td>
              <td className="py-3 px-6 border border-[#004aa3]">
                {user.specialization.replace(/\b\w/g, (char) =>
                  char.toUpperCase()
                )}
              </td>
              <td className="py-3 px-6 border border-[#004aa3] text-center">
                <button
                  onClick={() => setShowUpdateModal(true)}
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
                  user={user}
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

export default Doctors;
