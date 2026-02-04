import React, { useState } from "react";
import { axiosClient } from "../utils/AxiosClient";
import DeleteModal from "../components/discounts/deleteModal";
import DiscountUpdateModal from "../components/discounts/updateModal";
import { useNavigate } from "react-router-dom";
import { useMainContext } from "../context/mainContext";
import { toast } from "react-toastify";

const Discounts = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const { discounts, setDiscounts, user } = useMainContext();
  const [selectedDiscount, setSelectedDiscount] = useState(null);

  const onDelete = async () => {
    try {
      await axiosClient.delete(`/api/discounts/${selectedDiscount?.id}`);
      const deletedDiscounts = discounts.filter(
        (item) => item?.id !== selectedDiscount?.id
      );
      setDiscounts(deletedDiscounts);
      setSelectedDiscount(null);
      toast.success("Discount deleted successfully!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete discount");
    }
  };

  return (
    <div className=" justify-center">
      <div className="flex w-full xl:w-[90%] justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Discounts</h2>
        {user?.role === "admin" && (
          <button
            onClick={() => navigate("/discountcreate")}
            className="bg-[#004aa3] text-white px-4 py-2 rounded shadow"
          >
            + Discount
          </button>
        )}
      </div>
      <table className="w-full xl:w-[90%] rounded">
        <thead>
          <tr className="bg-gray-100 text-left text-sm uppercase text-gray-600">
            <th className="py-3 px-6 border border-[#004aa3]">Name</th>
            <th className="py-3 px-6 border border-[#004aa3]">Percentage</th>
            {user?.role === "admin" && (
              <th className="py-3 px-6 border border-[#004aa3] text-center">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {discounts?.map((item) => (
            <tr key={item.id} className="text-sm hover:bg-gray-50">
              <td className="py-3 px-6 border border-[#004aa3] capitalize">
                {item.discount_name}
              </td>
              <td className="py-3 px-6 border border-[#004aa3]">
                {item.discount_percentage}%
              </td>
              {user?.role === "admin" && (
                <td className="py-3 px-6 border border-[#004aa3] text-center">
                  <button
                    onClick={() => {
                      setSelectedDiscount(item);
                      setShowUpdateModal(true);
                    }}
                    className="bg-[#004aa3] text-white px-3 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setSelectedDiscount(item);
                      setShowModal(true);
                    }}
                    className="bg-[#004aa3] text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {showUpdateModal && selectedDiscount && (
        <DiscountUpdateModal
          discount={selectedDiscount}
          onClose={() => {
            setSelectedDiscount(null);
            setShowUpdateModal(false);
          }}
          setShowUpdateModal={setShowUpdateModal}
        />
      )}
      {showModal && selectedDiscount && (
        <DeleteModal
          title="Confirm Deletion"
          message={`Are you sure you want to delete ${selectedDiscount?.discount_name}?`}
          onCancel={() => {
            setSelectedDiscount(null);
            setShowModal(false);
          }}
          onConfirm={() => {
            onDelete();
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
};

export default Discounts;
