import React, { useState } from "react";
import { axiosClient } from "../utils/AxiosClient";
import DeleteModal from "../components/services/deleteModal";
import UserUpdateModal from "../components/services/updateModal";
import { useNavigate } from "react-router-dom";
import { useMainContext } from "../context/mainContext";
import { toast } from "react-toastify";

const Services = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const { services, setServices, user } = useMainContext();
  const [selectedUser, setSelectedUser] = useState(null);

  const onDelete = async () => {
    try {
      await axiosClient.delete(`/api/services/${selectedUser?.id}`);
      const deletedServ = services.filter(
        (user) => user?.id !== selectedUser?.id
      );
      setServices(deletedServ);
      setSelectedUser(null);
      toast.success("Service deleted successfully!");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className=" justify-center">
      <div className="flex w-full xl:w-[90%] justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Services</h2>
        {user?.role === "admin" && (
          <button
            onClick={() => navigate("/servicecreate")}
            className="bg-[#004aa3] text-white px-4 py-2 rounded shadow"
          >
            + Service
          </button>
        )}
      </div>
      <table className="w-full xl:w-[90%] rounded">
        <thead>
          <tr className="bg-gray-100 text-left text-sm uppercase text-gray-600">
            <th className="py-3 px-6 border border-[#004aa3]">Name</th>
            <th className="py-3 px-6 border border-[#004aa3]">Fees</th>
            {user?.role === "admin" && (
              <th className="py-3 px-6 border border-[#004aa3] text-center">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {services?.map((item) => (
            <tr key={item.id} className="text-sm hover:bg-gray-50">
              <td className="py-3 px-6 border border-[#004aa3] capitalize">
                {item.service_name}
              </td>
              <td className="py-3 px-6 border border-[#004aa3] capitalize">
                {item.service_fees}
              </td>
              {user?.role === "admin" && (
                <td className="py-3 px-6 border border-[#004aa3] text-center">
                  <button
                    onClick={() => {
                      setSelectedUser(item);
                      setShowUpdateModal(true);
                    }}
                    className="bg-[#004aa3] text-white px-3 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setSelectedUser(item);
                      setShowModal(true);
                    }}
                    className="bg-[#004aa3] text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              )}
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

export default Services;
