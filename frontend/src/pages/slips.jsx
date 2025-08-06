import React, { useRef, useState } from "react";
import UserUpdateModal from "../components/slips/updateModal";
import { useMainContext } from "../context/mainContext";
import SearchSlip from "../components/searchSlip";
import PrintSlip from "../components/slips/printSlips";
import { useReactToPrint } from "react-to-print";

const Slips = () => {
  const componentRef = useRef(null);
  const printFn = useReactToPrint({
    documentTitle: "AwesomeFileName",
    contentRef: componentRef,
    copyStyles: false
  });
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [generatedSlip, setGeneratedSlip] = useState(null);
  const [filteredSearch, setFilteredSearch] = useState([]);
  const { allSlips, setAllSlips } = useMainContext();
  const [selectedUser, setSelectedUser] = useState(null);
  const [showNo, setShowNo] = useState(false);

  return (
    <div className="flex justify-center h-[89vh]">
      <div className="w-full xl:w-[90%] flex flex-col overflow-hidden">
        <div className="flex justify-between items-center ">
          <h2 className="text-xl font-bold">Patient Slips</h2>
        </div>
        <SearchSlip
          setFilteredSearch={setFilteredSearch}
          setShowNo={setShowNo}
          showNo={showNo}
        />
        <h2 className="text-2xl font-bold text-center pb-4 underline">
          Records
        </h2>
        <div className="overflow-y-auto flex-1">
          {!showNo ? (
            (filteredSearch?.length > 0 ? filteredSearch : allSlips) ? (
              <table className="w-full rounded">
                <thead className="sticky top-0 bg-gray-100 z-10">
                  <tr className="text-left text-sm uppercase text-gray-600">
                    <th className="py-3 px-6 border border-[#004aa3]">
                      Token No.
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
                    <th className="py-3 px-6 border border-[#004aa3] text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(filteredSearch?.length > 0
                    ? filteredSearch
                    : allSlips
                  )?.map((user) => (
                    <tr key={user.id} className="text-sm hover:bg-gray-50">
                      <td className="py-3 px-6 border border-[#004aa3]">
                        {user?.token_no}
                      </td>
                      <td className="py-3 px-6 border border-[#004aa3] capitalize">
                        {user?.patient_name}
                      </td>
                      <td className="py-3 px-6 border border-[#004aa3] capitalize">
                        {user?.doctor_name}
                      </td>
                      <td className="py-3 px-6 border border-[#004aa3] capitalize">
                        {user?.type_name}
                      </td>
                      <td className="py-3 px-6 border border-[#004aa3] capitalize">
                        {user?.created_by_name}
                      </td>
                      <td className="py-3 px-6 border border-[#004aa3]">
                        {user?.doctor_fee || user?.pharmacy_fees}
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
                            setGeneratedSlip(user);
                            setTimeout(() => {
                              printFn();
                            }, 1000);
                          }}
                          className="bg-[#004aa3] text-white px-3 py-1 rounded mr-2"
                        >
                          View
                        </button>
                      </td>
                      {showUpdateModal && (
                        <UserUpdateModal
                          user={selectedUser}
                          onClose={() => setShowUpdateModal(false)}
                          setShowUpdateModal={setShowUpdateModal}
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
