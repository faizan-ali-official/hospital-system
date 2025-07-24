import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import CustomAuthButton from "../customButton";
import { axiosClient } from "../../utils/AxiosClient";
import { useMainContext } from "../../context/mainContext";

function UserUpdateModal({ user, onClose, setShowUpdateModal }) {
  const [loading, setLoading] = useState(false);
  const { doctors, feesTypes, allSlips, setAllSlips } = useMainContext();

  const onSubmitHandler = async (values) => {
    const payload = { ...values };
    if (!payload.reference_token_no) {
      delete payload.reference_token_no;
    }
    try {
      setLoading(true);
      const data = await axiosClient.put(
        `/api/patient-slips/${user.id}`,
        payload
      );
      console.log(data?.data?.updatedData);
      const updatedData = allSlips.map((item) =>
        item.id === user.id ? data?.data?.updatedData : item
      );
      toast.success("Slip updated successfully!");
      setAllSlips(updatedData);
      setShowUpdateModal(false);
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
    doctor_id: yup.string().required("Doctor is required"),
    fees_id: yup.string().required("Fees is required"),
    reference_token_no: yup.string().when("fees_id", {
      is: "3",
      then: (schema) =>
        schema
          .required("Reference No is required")
          .min(2, "Reference No must be at least 2 characters"),
      otherwise: (schema) => schema.notRequired()
    })
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
                    {doctors.map((item) => {
                      return (
                        <option
                          value={item?.id}
                        >{`Dr. ${item?.doctor_name}`}</option>
                      );
                    })}
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
                    {feesTypes.map((item) => {
                      return (
                        <option
                          value={item?.id}
                        >{`${item?.doctor_fee}`}</option>
                      );
                    })}
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
