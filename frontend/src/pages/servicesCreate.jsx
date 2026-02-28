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

function ServiceCreate() {
  const [loading, setLoading] = useState(false);
  const { services, setServices } = useMainContext();
  const navigate = useNavigate();

  const onSubmitHandler = async (values, helpers) => {
    try {
      setLoading(true);
      const data = await axiosClient.post("/api/services/", values);
      services.push(data?.data);
      setServices(services);
      navigate("/services");
      helpers.resetForm();
      toast.success("Service created successfully!");
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    } finally {
      setLoading(false);
    }
  };

  const initialValues = {
    name: "",
    fees: ""
  };

  const validationSchema = yup.object({
    name: yup
      .string()
      .required("Name is required")
      .min(2, "Name must be at least 2 characters"),
    fees: yup.string().required("Fees is required").min(1, "Fees is required")
  });

  return (
    <div className="flex justify-center min-h-0 flex-1">
      <div className="w-full xl:w-[95%] max-w-2xl flex flex-col overflow-hidden">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Create Service</h2>
        <div className="rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 p-6 shadow-sm">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmitHandler}
          >
            <Form className="space-y-3">
              <div>
                <Field
                  placeholder="Service Name"
                  type="text"
                  name="name"
                  className={fieldClass}
                />
                <ErrorMessage
                  name="name"
                  className="mt-1 text-xs text-red-500"
                  component="p"
                />
              </div>
              <div>
                <Field
                  placeholder="Service Fees"
                  type="text"
                  name="fees"
                  className={fieldClass}
                />
                <ErrorMessage
                  name="fees"
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

export default ServiceCreate;
