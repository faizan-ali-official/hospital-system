import React from "react";

const MemberDetailModal = ({ data, onClose }) => {
  if (!data) return null;
  const formatDate = (d) =>
    new Date(d).toISOString().split("T")[0].split("-").reverse().join("-");

  const calculateAge = (d) => {
    const dob = new Date(d);
    const t = new Date();
    let a = t.getFullYear() - dob.getFullYear();
    return t < new Date(t.getFullYear(), dob.getMonth(), dob.getDate())
      ? a - 1
      : a;
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-[90%] md:w-[700px] rounded-lg shadow-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-bold text-[#004aa3]">
            Community Card Details
          </h2>
          <button onClick={onClose} className="text-red-500 font-bold text-lg">
            ✕
          </button>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">
            Main Member
          </h3>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <p>
              <b>Name:</b> {data.full_name}
            </p>
            <p>
              <b>CNIC:</b> {data.cnic}
            </p>
            <p>
              <b>Guardian:</b> {data.guardian_name || "N/A"}
            </p>
            <p>
              <b>Contact:</b> {data.contact_number || "N/A"}
            </p>
            <p>
              <b>Card No:</b> {data.card_number || "N/A"}
            </p>
            <p>
              <b>Address:</b> {data.current_address || "N/A"}
            </p>
            <p>
              <b>DOB:</b> {formatDate(data.date_of_birth) || "N/A"}
            </p>
            <p>
              <b>Age:</b> {calculateAge(data.date_of_birth) ?? "N/A"}
            </p>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-700">
            Family Members
          </h3>
          {data.relations?.length ? (
            <div className="space-y-3">
              {data.relations.map((rel, index) => (
                <div
                  key={index}
                  className="border rounded p-3 bg-gray-50 text-sm"
                >
                  <p>
                    <b>Name:</b> {rel.full_name}
                  </p>
                  <p>
                    <b>Relation:</b> {rel.relation}
                  </p>
                  <p>
                    <b>CNIC:</b> {rel.cnic || "N/A"}
                  </p>
                  <p>
                    <b>DOB:</b> {formatDate(rel.date_of_birth) || "N/A"}
                  </p>
                  <p>
                    <b>Age:</b>{" "}
                    {`${calculateAge(rel.date_of_birth)} years` ?? "N/A"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No relations found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberDetailModal;
