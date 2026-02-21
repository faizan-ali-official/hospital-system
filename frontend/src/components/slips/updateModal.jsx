import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import { HiXMark } from "react-icons/hi2";
import CustomAuthButton from "../customButton";
import { axiosClient } from "../../utils/AxiosClient";
import { useMainContext } from "../../context/mainContext";
import Input from "../input/input";
import { customStyles } from "../../styles/customStyle";
import Select from "react-select";

const slipFieldClass =
  "input w-full h-10 py-0 px-3 rounded-lg border border-slate-200 text-sm outline-none focus:border-[#004aa3] focus:ring-2 focus:ring-[#004aa3]/20";

function UserUpdateModal({ user, onClose, setShowUpdateModal }) {
  const [loading, setLoading] = useState(false);
  const { doctors, feesTypes, services, discounts, allSlips, setAllSlips } =
    useMainContext();
  const onSubmitHandler = async (values) => {
    const payload = { ...values };
    if (!payload.reference_token_no) {
      delete payload.reference_token_no;
    }
    if (user.slip_type_id !== 1) {
      delete payload.discount_id;
    } else if (!payload.discount_id) {
      delete payload.discount_id;
    }
    try {
      setLoading(true);
      const data = await axiosClient.put(
        `/api/patient-slips/${user.id}`,
        payload,
      );
      const updatedData = allSlips.map((item) =>
        item.id === user.id ? data?.data?.updatedData : item,
      );
      toast.success("Slip updated successfully!");
      setAllSlips(updatedData);
      setShowUpdateModal(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
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
      service_id: Array.isArray(user.services)
        ? user.services.map((s) => s.id)
        : [],
      notes: user.notes || "",
    }),
    age: user.age || "",
    gender: user.gender || "",
    // is_card_holder: user.is_card_holder || false,
    ...(user.slip_type_id === 1 && { discount_id: user.discount_id || "" }),
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
      otherwise: (schema) => schema.notRequired(),
    }),
    service_id: yup.array().when("slip_type_id", {
      is: 2,
      then: (schema) =>
        schema
          .min(1, "At least one service is required")
          .required("Service is required"),
      otherwise: (schema) => schema.strip(),
    }),
    reference_token_no: yup.string().when(["slip_type_id", "fees_id"], {
      is: (slip_type_id, fees_id) =>
        Number(slip_type_id) === 2 ||
        (Number(slip_type_id) === 1 && fees_id === "3"),
      then: (schema) =>
        schema
          .required("Reference No is required")
          .min(1, "Reference No must be at least 1 characters"),
      otherwise: (schema) => schema.notRequired(),
    }),
    pharmacy_fees: yup.string().when("slip_type_id", {
      is: 2,
      then: (schema) =>
        schema
          .required("Fees is required")
          .matches(/^\d+$/, "Fees must be a number"),
      otherwise: (schema) => schema.strip(),
    }),
    notes: yup.string().when("slip_type_id", {
      is: 2,
      then: (schema) => schema,
      otherwise: (schema) => schema.strip(),
    }),
    age: yup.number().required("Age is required"),
    gender: yup
      .string()
      .required("Gender is required")
      .oneOf(["Male", "Female"], "Invalid gender"),
  });

  const slipTitle =
    user?.type_name?.replace(/\b\w/g, (char) => char.toUpperCase()) ?? "Edit";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200/80 bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-xl font-bold text-slate-800">{slipTitle} Slip</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <HiXMark className="w-5 h-5" />
          </button>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmitHandler}
          enableReinitialize
        >
          {({ values, setFieldValue }) => (
            <Form className="px-6 py-5">
              <div className="space-y-3">
                <Input
                  placeholder="Patient Name"
                  name="patient_name"
                  errorName="patient_name"
                  showLabel={false}
                  compact
                  className="h-10 py-0 px-3 mb-3"
                />
                <div>
                  <Field name="doctor_id">
                    {({ field }) => (
                      <select
                        {...field}
                        className={`${slipFieldClass} ${field.value ? "text-slate-800" : "text-slate-400"}`}
                      >
                        <option value="">Select Doctor</option>
                        {doctors.map((item) => (
                          <option key={item?.id} value={item?.id}>
                            Dr. {item?.doctor_name}
                          </option>
                        ))}
                      </select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="doctor_id"
                    className="mt-1 text-xs text-red-500"
                    component="p"
                  />
                </div>
                <Input
                  placeholder="Age"
                  name="age"
                  errorName="age"
                  showLabel={false}
                  compact
                  className="h-10 py-0 px-3 mb-3"
                />
                <div>
                  <Field name="gender">
                    {({ field }) => (
                      <select
                        {...field}
                        className={`${slipFieldClass} ${field.value ? "text-slate-800" : "text-slate-400"}`}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="gender"
                    className="mt-1 text-xs text-red-500"
                    component="p"
                  />
                </div>

                {user.slip_type_id === 2 && (
                  <div>
                    <Field name="service_id">
                      {({ field, form }) => {
                        const options = services.map((item) => ({
                          value: item.id,
                          label: `${item.service_name} (Rs.${item.service_fees})`,
                        }));
                        return (
                          <Select
                            isMulti
                            options={options}
                            value={options.filter((opt) =>
                              field.value?.includes(opt.value),
                            )}
                            placeholder="Select Service"
                            onChange={(selected) =>
                              form.setFieldValue(
                                "service_id",
                                selected.map((i) => i.value),
                              )
                            }
                            styles={customStyles}
                            classNamePrefix="edit-slip-select"
                          />
                        );
                      }}
                    </Field>
                    <ErrorMessage
                      name="service_id"
                      className="mt-1 text-xs text-red-500"
                      component="p"
                    />
                  </div>
                )}

                {user.slip_type_id === 1 ? (
                  <div>
                    <Field name="fees_id">
                      {({ field }) => (
                        <select
                          {...field}
                          className={`${slipFieldClass} ${field.value ? "text-slate-800" : "text-slate-400"}`}
                        >
                          <option value="">Slip Type</option>
                          {feesTypes.map((item) => (
                            <option key={item?.id} value={item?.id}>
                              {item?.doctor_fee}
                            </option>
                          ))}
                        </select>
                      )}
                    </Field>
                    <ErrorMessage
                      name="fees_id"
                      className="mt-1 text-xs text-red-500"
                      component="p"
                    />
                  </div>
                ) : (
                  <Input
                    placeholder="Pharmacy fees"
                    name="pharmacy_fees"
                    errorName="pharmacy_fees"
                    showLabel={false}
                    compact
                    className="h-10 py-0 px-3"
                  />
                )}

                {user.slip_type_id === 1 && (
                  <div>
                    <Field name="discount_id">
                      {({ field }) => (
                        <select
                          {...field}
                          className={`${slipFieldClass} ${field.value ? "text-slate-800" : "text-slate-400"}`}
                        >
                          <option value="">No Discount</option>
                          {discounts?.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.discount_name} ({item.discount_percentage}%)
                            </option>
                          ))}
                        </select>
                      )}
                    </Field>
                  </div>
                )}

                {user.slip_type_id === 2 && (
                  <>
                    <Input
                      placeholder="Reference No"
                      name="reference_token_no"
                      errorName="reference_token_no"
                      showLabel={false}
                      compact
                      className="h-10 py-0 px-3"
                    />
                    <Input
                      placeholder="Description (optional)"
                      name="notes"
                      errorName="notes"
                      showLabel={false}
                      compact
                      className="h-10 py-0 px-3"
                    />
                  </>
                )}
              </div>

              <div className="mt-5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="h-10 rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Cancel
                </button>
                <CustomAuthButton
                  isLoading={loading}
                  text="Update Slip"
                  type="submit"
                  className="!h-10 !rounded-lg !py-0 !text-sm"
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default UserUpdateModal;
