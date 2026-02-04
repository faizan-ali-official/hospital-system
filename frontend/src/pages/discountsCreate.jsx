import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import CustomAuthButton from "../components/customButton";
import { axiosClient } from "../utils/AxiosClient";
import { useMainContext } from "../context/mainContext";
import { useNavigate } from "react-router-dom";

function DiscountCreate() {
  const [loading, setLoading] = useState(false);
  const { discounts, setDiscounts } = useMainContext();
  const navigate = useNavigate();

  const onSubmitHandler = async (values, helpers) => {
    try {
      setLoading(true);
      const data = await axiosClient.post("/api/discounts/", values);
      setDiscounts([...discounts, data?.data]);
      navigate("/discounts");
      helpers.resetForm();
      toast.success("Discount created successfully!");
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    } finally {
      setLoading(false);
    }
  };

  const initialValues = {
    name: "",
    percentage: ""
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
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full xl:w-[40%] mx-10 xl:mx-0 py-10 flex items-start rounded-md shadow-lg shadow-[#004aa3]">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmitHandler}
        >
          <Form className="w-full px-10 py-10 lg:mx-10">
            <p className="text-center pb-8 font-bold text-2xl underline">
              Create Discount
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
            <div className="mb-3 flex justify-center">
              <CustomAuthButton
                isLoading={loading}
                text="Create"
                type="submit"
              />
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
}

export default DiscountCreate;
