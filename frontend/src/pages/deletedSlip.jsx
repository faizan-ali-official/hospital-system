import React from "react";
import { useMainContext } from "../context/mainContext";

const DeletedSlips = () => {
  const { deleteSlips } = useMainContext();
  return (
    <div className="flex justify-center h-[calc(89vh - 33px)]">
      <div className="w-full xl:w-[90%] flex flex-col overflow-hidden">
        <div className="flex justify-between items-center ">
          <h2 className="text-xl font-bold">Deleted Slips</h2>
        </div>
        <h2 className="text-2xl font-bold text-center pb-4 underline">
          Records
        </h2>
        <div className="overflow-y-auto flex-1 max-h-[calc(89vh-80px)]">
          {deleteSlips ? (
            <table className="w-full rounded">
              <thead className="sticky top-0 bg-gray-100 z-10">
                <tr className="text-left text-sm uppercase text-gray-600">
                  <th className="py-3 px-6 border border-[#004aa3]">Slip ID</th>
                  <th className="py-3 px-6 border border-[#004aa3]">
                    Patient Name
                  </th>
                  <th className="py-3 px-6 border border-[#004aa3]">
                    Deleted By
                  </th>
                  <th className="py-3 px-6 border border-[#004aa3]">
                    Slip Type
                  </th>
                  <th className="py-3 px-6 border border-[#004aa3]">Date</th>
                  <th className="py-3 px-6 border border-[#004aa3]">
                    Delete Reason
                  </th>
                </tr>
              </thead>
              <tbody>
                {deleteSlips.map((item) => (
                  <tr key={item.id} className="text-sm hover:bg-gray-50">
                    <td className="py-3 px-6 border border-[#004aa3]">
                      {item?.id}
                    </td>
                    <td className="py-3 px-6 border border-[#004aa3] capitalize">
                      {item?.patient_name}
                    </td>
                    <td className="py-3 px-6 border border-[#004aa3] capitalize">
                      {item?.deleted_by_name}
                    </td>
                    <td className="py-3 px-6 border border-[#004aa3] capitalize">
                      {item?.slip_type_name}
                    </td>
                    <td className="py-3 px-6 border border-[#004aa3]">
                      {new Date(item.deleted_at)
                        .toLocaleDateString("en-GB")
                        .replace(/\//g, "-")}
                    </td>
                    <td className="py-3 px-6 border border-[#004aa3]">
                      {item?.delete_note}
                    </td>
                  </tr>
                ))}
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

export default DeletedSlips;
