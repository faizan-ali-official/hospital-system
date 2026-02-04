import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import CustomAuthButton from "../customButton";
import { axiosClient } from "../../utils/AxiosClient";
import { useMainContext } from "../../context/mainContext";

function DiscountUpdateModal({ discount, onClose, setShowUpdateModal }) {
  const [loading, setLoading] = useState(false);
  const { discounts, setDiscounts } = useMainContext();

  const onSubmitHandler = async (values) => {
    try {
      setLoading(true);
      const update = await axiosClient.put(
        `/api/discounts/${discount.id}`,
        values
      );
      const updatedData = discounts.map((item) =>
        item.id === discount.id ? update?.data?.updatedDiscount : item
      );
      setDiscounts(updatedData);
      toast.success("Discount updated successfully!");
      setShowUpdateModal(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    } finally {
      setLoading(false);
    }
  };

  const initialValues = {
    name: discount.discount_name || "",
    percentage: discount.discount_percentage ?? ""
  };

  const validationSchema = yup.object({
    name: yup
      .string()
      .required("Name is required")
      .min(2, "Name must be at least 2 characters"),
    percentage: yup
      .number()
      .required("Percentage is required")
      .min(0, "Percentage must be at least 0")
      .max(100, "Percentage must be at most 100")
  });

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded shadow-lg relative">
        <button
          className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
          onClick={onClose}
        >
          &times;
        </button>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmitHandler}
          enableReinitialize
        >
          <Form>
            <p className="text-center font-bold text-xl mb-6 underline">
              Update Discount
            </p>
            <div className="mb-3">
              <Field
                placeholder="Discount Name"
                type="text"
                name="name"
                className="input w-full py-3 px-3 rounded border outline-none"
              />
              <ErrorMessage
                name="name"
                className="text-red-500"
                component="p"
              />
            </div>
            <div className="mb-3">
              <Field
                placeholder="Discount Percentage (%)"
                type="number"
                name="percentage"
                min="0"
                max="100"
                step="0.01"
                className="input w-full py-3 px-3 rounded border outline-none"
              />
              <ErrorMessage
                name="percentage"
                className="text-red-500"
                component="p"
              />
            </div>
            <div className="text-center">
              <CustomAuthButton
                isLoading={loading}
                text="Update"
                type="submit"
              />
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
}

export default DiscountUpdateModal;
