import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import CustomAuthButton from "../components/customButton";
import { axiosClient } from "../utils/AxiosClient";
import { useMainContext } from "../context/mainContext";
import { useNavigate } from "react-router-dom";

const fieldClass =
  "input w-full h-10 py-0 px-3 rounded-lg border border-slate-200 dark:border-slate-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm outline-none focus:border-[#004aa3] dark:focus:border-sky-400 focus:ring-2 focus:ring-[#004aa3]/20 dark:focus:ring-sky-400/20";

function DoctorCreate() {
  const [loading, setLoading] = useState(false);
  const { doctors, setDoctors } = useMainContext();
  const navigate = useNavigate();

  const onSubmitHandler = async (values, helpers) => {
    try {
      setLoading(true);
      const data = await axiosClient.post("/api/doctor/", values);
      doctors.push(data?.data);
      setDoctors(doctors);
      navigate("/doctors");
      helpers.resetForm();
      toast.success("Doctor created successfully!");
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    } finally {
      setLoading(false);
    }
  };

  const initialValues = {
    doctor_name: "",
    specialization: ""
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
    <div className="flex justify-center min-h-0 flex-1">
      <div className="w-full xl:w-[95%] max-w-2xl flex flex-col overflow-hidden">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Create Doctor</h2>
        <div className="rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 p-6 shadow-sm">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmitHandler}
          >
            <Form className="space-y-3">
              <div>
                <Field
                  placeholder="Doctor Name"
                  type="text"
                  name="doctor_name"
                  className={fieldClass}
                />
                <ErrorMessage
                  name="doctor_name"
                  className="mt-1 text-xs text-red-500"
                  component="p"
                />
              </div>
              <div>
                <Field
                  placeholder="Specialization"
                  type="text"
                  name="specialization"
                  className={fieldClass}
                />
                <ErrorMessage
                  name="specialization"
                  className="mt-1 text-xs text-red-500"
                  component="p"
                />
              </div>
              <div className="pt-2 flex justify-end">
                <CustomAuthButton
                  isLoading={loading}
                  text="Create"
                  type="submit"
                  className="!h-10 !rounded-lg !py-0 !text-sm"
                />
              </div>
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default DoctorCreate;
