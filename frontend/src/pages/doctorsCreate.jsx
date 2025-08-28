import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import CustomAuthButton from "../components/customButton";
import { axiosClient } from "../utils/AxiosClient";
import { useMainContext } from "../context/mainContext";
import { useNavigate } from "react-router-dom";

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
      console.log(error);
      toast.error(error?.response?.data?.msg || error?.message);
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
      .required("Specialization is Required")
      .min(2, "Specialization must be at least 2 characters")
  });

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full xl:w-[40%] mx-10 xl:mx-0 py-10 flex items-start  rounded-md shadow-lg shadow-[#004aa3]">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmitHandler}
        >
          <Form className="w-full  px-10 py-10  lg:mx-10 ">
            <p className="text-center pb-8 font-bold text-2xl underline">
              Create Doctor
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

export default DoctorCreate;
