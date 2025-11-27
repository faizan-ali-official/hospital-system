import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import CustomAuthButton from "../customButton";
import { axiosClient } from "../../utils/AxiosClient";
import { useMainContext } from "../../context/mainContext";

function UserUpdateModal({ user, onClose, setShowUpdateModal }) {
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
      toast.success("Services updated successfully!");
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
    fees: yup
      .string()
      .required("Fees is Required")
      .min(2, "Fees must be at least 2 characters")
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
              Update Service
            </p>
            <div className="mb-3">
              <Field
                placeholder="Service Name"
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
                placeholder="Fees"
                type="text"
                name="fees"
                className="input w-full py-3 px-3 rounded border outline-none"
              />
              <ErrorMessage
                name="fees"
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

export default UserUpdateModal;
