import React, { useEffect, useState } from "react";
import { axiosClient } from "../utils/AxiosClient";
import DeleteModal from "../components/slips/deleteModal";
import UserUpdateModal from "../components/slips/updateModal";
import { useNavigate } from "react-router-dom";
import { useMainContext } from "../context/mainContext";

const Slips = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const { allSlips, setAllSlips } = useMainContext();

  const onDelete = async (id) => {
    try {
      await axiosClient.delete(`/api/patient-slips/${id}`);
      const deletedSlips = allSlips.filter((user) => user?.id !== id);
      setAllSlips(deletedSlips);
    } catch (err) {
      console.log(err);
    }
  };
  console.log(allSlips, "ak");
  return (
    <div className=" justify-center">
      <div className="flex w-full xl:w-[90%] justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Patient Slips</h2>
      </div>
      <table className="w-full xl:w-[90%] rounded">
        <thead>
          <tr className="bg-gray-100 text-left text-sm uppercase text-gray-600">
            <th className="py-3 px-6 border border-[#004aa3]">Patient Name</th>
            <th className="py-3 px-6 border border-[#004aa3]">Doctor</th>
            <th className="py-3 px-6 border border-[#004aa3]">Fees</th>
            <th className="py-3 px-6 border border-[#004aa3] text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {allSlips?.map((user) => (
            <tr key={user.id} className="text-sm hover:bg-gray-50">
              <td className="py-3 px-6 border border-red-100">
                {user?.patient_name?.replace(/\b\w/g, (char) =>
                  char.toUpperCase()
                )}
              </td>
              <td className="py-3 px-6 border border-red-100">
                {user?.doctor_id?.replace(/\b\w/g, (char) =>
                  char.toUpperCase()
                )}
              </td>
              <td className="py-3 px-6 border border-red-100">
                {user?.fees_id?.replace(/\b\w/g, (char) => char.toUpperCase())}
              </td>
              <td className="py-3 px-6 border border-red-100 text-center">
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

export default Slips;
