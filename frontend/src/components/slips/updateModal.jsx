import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import CustomAuthButton from "../customButton";
import { axiosClient } from "../../utils/AxiosClient";

function UserUpdateModal({ user, onClose, onUpdated }) {
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (values) => {
    try {
      setLoading(true);
      await axiosClient.put(`/api/doctors/${user.id}`, values);
      toast.success("Doctors updated successfully!");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg || error?.message);
    } finally {
      setLoading(false);
    }
  };

  const initialValues = {
    patient_name: user.patient_name || "",
    doctor_id: user.doctor_id || "",
    fees_id: user.fees_id || "",
    reference_token_no: user.reference_token_no || ""
  };

  const validationSchema = yup.object({
    patient_name: yup
      .string()
      .required("Name is required")
      .min(2, "Name must be at least 2 characters"),
    doctor_id: yup
      .string()
      .required("Doctor is required")
      .oneOf(["Doctor", "operator", "patient"], "Invalid role"),
    fees_id: yup
      .string()
      .required("Fees is required")
      .oneOf(["Doctor", "operator", "patient"], "Invalid role"),
    reference_token_no: yup
      .string()
      .required("Reference No is required")
      .min(2, "Reference No must be at least 2 characters")
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
          <Form className="w-full  px-10 py-10  lg:mx-10 ">
            <p className="text-center pb-8 font-bold text-2xl underline">
              Patient Slip
            </p>
            <div className="mb-3">
              <Field
                placeholder="Patient Name"
                type="text"
                name="patient_name"
                className="input w-full py-3 px-3 rounded border outline-none"
              />
              <ErrorMessage
                name="patient_name"
                className="text-red-500"
                component="p"
              />
            </div>
            <div className="mb-3">
              <Field name="doctor_id">
                {({ field, form }) => (
                  <select
                    {...field}
                    className={`input w-full py-3 px-3 rounded border outline-none ${
                      field.value ? "text-black" : "text-gray-400"
                    }`}
                  >
                    <option value="">Select Doctor</option>
                    <option value="Doctor">Dr.Asad</option>
                    <option value="operator">Dr.Kamran</option>
                  </select>
                )}
              </Field>
              <ErrorMessage
                name="doctor_id"
                className="text-red-500"
                component="p"
              />
            </div>
            <div className="mb-3">
              <Field name="fees_id">
                {({ field, form }) => (
                  <select
                    {...field}
                    className={`input w-full py-3 px-3 rounded border outline-none ${
                      field.value ? "text-black" : "text-gray-400"
                    }`}
                  >
                    <option value="">Slip Type</option>
                    <option value="100">100</option>
                    <option value="300">300</option>
                  </select>
                )}
              </Field>
              <ErrorMessage
                name="fees_id"
                className="text-red-500"
                component="p"
              />
            </div>
            <div className="mb-3">
              <Field
                placeholder="Reference No"
                type="text"
                name="reference_token_no"
                className="input w-full py-3 px-3 rounded border outline-none"
              />
              <ErrorMessage
                name="reference_token_no"
                className="text-red-500"
                component="p"
              />
            </div>
            <div className=" mt-10 flex justify-center">
              <CustomAuthButton
                isLoading={loading}
                text="Generate"
                type="submit"
              />
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
}

export default UserUpdateModal;
