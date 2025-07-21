import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import CustomAuthButton from "../components/customButton";
import { axiosClient } from "../utils/AxiosClient";

function UserCreate() {
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (values, helpers) => {
    try {
      setLoading(true);
      await axiosClient.post("/api/user/", values);
      helpers.resetForm();
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg || error?.message);
    } finally {
      setLoading(false);
    }
  };

  const initialValues = {
    name: "",
    email: "",
    password: "",
    roleId: ""
  };

  const validationSchema = yup.object({
    name: yup
      .string()
      .required("Name is required")
      .min(2, "Name must be at least 2 characters"),
    email: yup
      .string()
      .required("Email is Required")
      .email("Email must be valid"),
    roleId: yup
      .string()
      .required("Role is required")
      .oneOf(["1", "2"], "Invalid role"),
    password: yup.string().required("Password is Required")
  });

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full xl:w-[40%] mx-10 xl:mx-0 py-10 flex items-start  rounded-md shadow-lg  shadow-[#004aa3]">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmitHandler}
        >
          <Form className="w-full  px-10 py-10  lg:mx-10 ">
            <p className="text-center pb-8 font-bold text-2xl underline">
              Create User
            </p>
            <div className="mb-3">
              <Field
                placeholder="Name"
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
                placeholder="Email"
                type="text"
                name="email"
                className="input w-full py-3 px-3 rounded border outline-none"
              />
              <ErrorMessage
                name="email"
                className="text-red-500"
                component="p"
              />
            </div>
            <div className="mb-3">
              <Field name="roleId">
                {({ field, form }) => (
                  <select
                    {...field}
                    className={`input w-full py-3 px-3 rounded border outline-none ${
                      field.value ? "text-black" : "text-gray-400"
                    }`}
                  >
                    <option value="">Role</option>
                    <option value="1">Admin</option>
                    <option value="2">Operator</option>
                  </select>
                )}
              </Field>
              <ErrorMessage
                name="roleId"
                className="text-red-500"
                component="p"
              />
            </div>
            <div className="mb-10">
              <Field
                placeholder="Password"
                type="password"
                name="password"
                className="input w-full py-3 px-3 rounded border outline-none"
              />
              <ErrorMessage
                name="password"
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

export default UserCreate;
