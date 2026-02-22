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

function ServiceUpdateModal({ user, onClose, setShowUpdateModal }) {
  const [loading, setLoading] = useState(false);
  const { services, setServices } = useMainContext();

  const onSubmitHandler = async (values) => {
    try {
      setLoading(true);
      const update = await axiosClient.put(`/api/services/${user.id}`, values);
      const updatedData = services.map((item) =>
        item.id === user.id ? update?.data?.updatedService : item
      );
      setServices(updatedData);
      toast.success("Service updated successfully!");
      setShowUpdateModal(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    } finally {
      setLoading(false);
    }
  };

  const initialValues = {
    name: user.service_name || "",
    fees: user.service_fees || ""
  };

  const validationSchema = yup.object({
    name: yup
      .string()
      .required("Name is required")
      .min(2, "Name must be at least 2 characters"),
    fees: yup.string().required("Fees is required").min(1, "Fees is required")
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200/80 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-xl font-bold text-slate-800">Edit Service</h2>
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
                  placeholder="Service Name"
                  type="text"
                  name="name"
                  className={slipFieldClass}
                />
                <ErrorMessage
                  name="name"
                  component="p"
                  className="mt-1 text-xs text-red-500"
                />
              </div>
              <div>
                <Field
                  placeholder="Fees"
                  type="text"
                  name="fees"
                  className={slipFieldClass}
                />
                <ErrorMessage
                  name="fees"
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

export default ServiceUpdateModal;
