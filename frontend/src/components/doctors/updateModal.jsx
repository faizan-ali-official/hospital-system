import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import { HiXMark } from "react-icons/hi2";
import CustomAuthButton from "../customButton";
import { axiosClient } from "../../utils/AxiosClient";
import { useMainContext } from "../../context/mainContext";

const slipFieldClass =
  "input w-full h-10 py-0 px-3 rounded-lg border border-slate-200 text-sm outline-none focus:border-[#004aa3] focus:ring-2 focus:ring-[#004aa3]/20";

function DoctorUpdateModal({ user, onClose, setShowUpdateModal }) {
  const [loading, setLoading] = useState(false);
  const { doctors, setDoctors } = useMainContext();

  const onSubmitHandler = async (values) => {
    try {
      setLoading(true);
      await axiosClient.put(`/api/doctor/${user.id}`, values);
      const updatedData = doctors.map((item) =>
        item.id === user.id ? { ...item, ...values } : item
      );
      toast.success("Doctor updated successfully!");
      setDoctors(updatedData);
      setShowUpdateModal(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    } finally {
      setLoading(false);
    }
  };

  const initialValues = {
    doctor_name: user.doctor_name || "",
    specialization: user.specialization || ""
  };

  const validationSchema = yup.object({
    doctor_name: yup
      .string()
      .required("Name is required")
      .min(2, "Name must be at least 2 characters"),
    specialization: yup
      .string()
      .required("Specialization is required")
      .min(2, "Specialization must be at least 2 characters")
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200/80 bg-white shadow-xl">
        {/* Header - same as slip/user update modal */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-xl font-bold text-slate-800">Edit Doctor</h2>
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
          <Form className="px-6 py-5">
            <div className="space-y-3">
              <div>
                <Field
                  placeholder="Doctor Name"
                  type="text"
                  name="doctor_name"
                  className={slipFieldClass}
                />
                <ErrorMessage
                  name="doctor_name"
                  component="p"
                  className="mt-1 text-xs text-red-500"
                />
              </div>
              <div>
                <Field
                  placeholder="Specialization"
                  type="text"
                  name="specialization"
                  className={slipFieldClass}
                />
                <ErrorMessage
                  name="specialization"
                  component="p"
                  className="mt-1 text-xs text-red-500"
                />
              </div>
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
                text="Update"
                type="submit"
                className="!h-10 !rounded-lg !py-0 !text-sm"
              />
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
}

export default DoctorUpdateModal;
