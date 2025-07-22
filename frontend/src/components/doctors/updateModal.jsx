import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import CustomAuthButton from "../customButton";
import { axiosClient } from "../../utils/AxiosClient";
import { useMainContext } from "../../context/mainContext";

function UserUpdateModal({ user, onClose, setShowUpdateModal }) {
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
      console.log(error);
      toast.error(error?.response?.data?.msg || error?.message);
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
      .required("Specialization is Required")
      .min(2, "Specialization must be at least 2 characters")
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
              Update Doctor
            </p>
            <div className="mb-3">
              <Field
                placeholder="Doctor Name"
                type="text"
                name="doctor_name"
                className="input w-full py-3 px-3 rounded border outline-none"
              />
              <ErrorMessage
                name="doctor_name"
                className="text-red-500"
                component="p"
              />
            </div>
            <div className="mb-3">
              <Field
                placeholder="Specialization"
                type="text"
                name="specialization"
                className="input w-full py-3 px-3 rounded border outline-none"
              />
              <ErrorMessage
                name="specialization"
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
