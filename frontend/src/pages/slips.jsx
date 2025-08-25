import React, { useRef, useState } from "react";
import UserUpdateModal from "../components/slips/updateModal";
import DeleteModal from "../components/slips/deleteModal";
import { useMainContext } from "../context/mainContext";
import SearchSlip from "../components/searchSlip";
import PrintSlip from "../components/slips/printSlips";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";
import { axiosClient } from "../utils/AxiosClient";

const Slips = () => {
  const componentRef = useRef(null);
  const printFn = useReactToPrint({
    documentTitle: "AwesomeFileName",
    contentRef: componentRef,
    copyStyles: false
  });
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [generatedSlip, setGeneratedSlip] = useState(null);
  const { allSlips, setAllSlips, user } = useMainContext();
  const [selectedUser, setSelectedUser] = useState(null);
  const [showNo, setShowNo] = useState(false);

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
        <SearchSlip
          setFilteredSearch={setAllSlips}
          setShowNo={setShowNo}
          showNo={showNo}
        />
        <h2 className="text-2xl font-bold text-center pb-4 underline">
          Records
        </h2>
        <div className="overflow-y-auto flex-1">
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
                    <th className="py-3 px-6 border border-[#004aa3]">
                      Created By
                    </th>
                    <th className="py-3 px-6 border border-[#004aa3]">Fees</th>
                    {user?.role === "admin" && (
                      <th className="py-3 px-6 border border-[#004aa3] text-center">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {allSlips.map((item) => (
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
                        {item?.type_name}
                      </td>
                      <td className="py-3 px-6 border border-[#004aa3] capitalize">
                        {item?.created_by_name}
                      </td>
                      <td className="py-3 px-6 border border-[#004aa3]">
                        {item?.doctor_fee || item?.pharmacy_fees}
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
                            className="bg-[#004aa3] text-white px-3 py-1 rounded mr-2"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => {
                              setGeneratedSlip(item);
                              setTimeout(() => {
                                printFn();
                              }, 1000);
                            }}
                            className="bg-[#004aa3] text-white px-3 py-1 rounded mr-2"
                          >
                            View
                          </button>
                        </td>
                      )}
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
                        />
                      )}
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
              <p className="text-center font-bold text-xl ">No Data Found</p>
            </div>
          )}
        </div>
      </div>
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
