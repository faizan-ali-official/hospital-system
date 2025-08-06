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
    ...(user.slip_type_id === 1 && { fees_id: user.fees_id || "" }),
    reference_token_no: user.reference_token_no || "",
    slip_type_id: user.slip_type_id || "",
    ...(user.slip_type_id === 2 && {
      pharmacy_fees: user.pharmacy_fees || "",
      notes: user.notes || ""
    })
  };

  const validationSchema = yup.object({
    patient_name: yup
      .string()
      .required("Name is required")
      .min(2, "Name must be at least 2 characters"),
    doctor_id: yup.string().required("Doctor is required"),
    fees_id: yup.string().when("slip_type_id", {
      is: 1,
      then: (schema) => schema.required("Fees is required"),
      otherwise: (schema) => schema.notRequired()
    }),
    reference_token_no: yup.string().when(["slip_type_id", "fees_id"], {
      is: (slip_type_id, fees_id) =>
        Number(slip_type_id) === 2 ||
        (Number(slip_type_id) === 1 && fees_id === "3"),
      then: (schema) =>
        schema
          .required("Reference No is required")
          .min(1, "Reference No must be at least 1 characters"),
      otherwise: (schema) => schema.notRequired()
    }),
    pharmacy_fees: yup.string().when("slip_type_id", {
      is: 2,
      then: (schema) =>
        schema
          .required("Fees is required")
          .matches(/^\d+$/, "Fees must be a number"),
      otherwise: (schema) => schema.strip()
    }),
    notes: yup.string().when("slip_type_id", {
      is: 2,
      then: (schema) => schema,
      otherwise: (schema) => schema.strip()
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
              {user?.type_name?.replace(/\b\w/g, (char) => char.toUpperCase())}{" "}
              Slip
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
            {user.slip_type_id === 1 ? (
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
            ) : (
              <div className="mb-3">
                <Field
                  placeholder="Pharmacy fees"
                  type="text"
                  name="pharmacy_fees"
                  className="input w-full py-3 px-3 rounded border outline-none"
                />
                <ErrorMessage
                  name="pharmacy_fees"
                  className="text-red-500"
                  component="p"
                />
              </div>
            )}
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
            {user.slip_type_id === 2 && (
              <div className="mb-3">
                <Field
                  placeholder="Description (optional)"
                  type="text"
                  name="notes"
                  className="input w-full py-3 px-3 rounded border outline-none"
                />
              </div>
            )}

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
