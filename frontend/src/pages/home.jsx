import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import CustomAuthButton from "../components/customButton";
import { axiosClient } from "../utils/AxiosClient";
import { useMainContext } from "../context/mainContext";

function Home() {
  const [loading, setLoading] = useState(false);
  const { doctors } = useMainContext();

  const onSubmitHandler = async (values, helpers) => {
    try {
      setLoading(true);
      await axiosClient.post("/api/patient-slips/", values);
      helpers.resetForm();
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg || error?.message);
    } finally {
      setLoading(false);
    }
  };

  const initialValues = {
    patient_name: "",
    doctor_id: "",
    fees_id: "",
    reference_token_no: ""
  };
  const validationSchema = yup.object({
    patient_name: yup
      .string()
      .required("Name is required")
      .min(2, "Name must be at least 2 characters"),
    doctor_id: yup.string().required("Doctor is required"),
    fees_id: yup.string().required("Fees is required"),
    reference_token_no: yup
      .string()
      // .required("Reference No is required")
      .min(2, "Reference No must be at least 2 characters")
  });

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full xl:w-[40%] mx-10 xl:mx-0 py-10 flex items-start  rounded-md shadow-lg   shadow-[#004aa3] ">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmitHandler}
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
                    <option value="1">100</option>
                    <option value="2">300</option>
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

export default Home;
