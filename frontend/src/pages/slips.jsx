import React, { useState } from "react";
import { axiosClient } from "../utils/AxiosClient";
import DeleteModal from "../components/slips/deleteModal";
import UserUpdateModal from "../components/slips/updateModal";
import { useMainContext } from "../context/mainContext";
import { toast } from "react-toastify";
import SearchSlip from "../components/searchSlip";

const Slips = () => {
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [filteredSearch, setFilteredSearch] = useState([]);
  const { allSlips, setAllSlips } = useMainContext();
  const [selectedUser, setSelectedUser] = useState(null);

  const onDelete = async () => {
    try {
      await axiosClient.delete(`/api/patient-slips/${selectedUser?.id}`);
      const deletedSlips = allSlips.filter(
        (user) => user?.id !== selectedUser?.id
      );
      setAllSlips(deletedSlips);
      setSelectedUser(null);
      toast.success("Slip deleted successfully!");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex justify-center h-[89vh]">
      <div className="w-full xl:w-[90%] flex flex-col overflow-hidden">
        <div className="flex justify-between items-center ">
          <h2 className="text-xl font-bold">Patient Slips</h2>
        </div>

        <SearchSlip setFilteredSearch={setFilteredSearch} />

        <h2 className="text-2xl font-bold text-center pb-4 underline">
          Records
        </h2>
        <div className="overflow-y-auto flex-1">
          {(filteredSearch?.length > 0 ? filteredSearch : allSlips) ? (
            <table className="w-full rounded">
              <thead className="sticky top-0 bg-gray-100 z-10">
                <tr className="text-left text-sm uppercase text-gray-600">
                  <th className="py-3 px-6 border border-[#004aa3]">
                    Token No.
                  </th>
                  <th className="py-3 px-6 border border-[#004aa3]">
                    Patient Name
                  </th>
                  <th className="py-3 px-6 border border-[#004aa3]">Doctor</th>
                  <th className="py-3 px-6 border border-[#004aa3]">Fees</th>
                  <th className="py-3 px-6 border border-[#004aa3] text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {(filteredSearch?.length > 0 ? filteredSearch : allSlips)?.map(
                  (user) => (
                    <tr key={user.id} className="text-sm hover:bg-gray-50">
                      <td className="py-3 px-6 border border-[#004aa3]">
                        {user?.token_no}
                      </td>
                      <td className="py-3 px-6 border border-[#004aa3]">
                        {user?.patient_name?.replace(/\b\w/g, (char) =>
                          char.toUpperCase()
                        )}
                      </td>
                      <td className="py-3 px-6 border border-[#004aa3]">
                        {user?.doctor_name?.replace(/\b\w/g, (char) =>
                          char.toUpperCase()
                        )}
                      </td>
                      <td className="py-3 px-6 border border-[#004aa3]">
                        {user?.doctor_fee}
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
                        />
                      )}
                    </tr>
                  )
                )}
              </tbody>
            </table>
          ) : (
            <div className="min-h-[400px] flex items-center justify-center text-gray-500 text-lg">
              No data found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Slips;
