import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import CustomAuthButton from "../components/customButton";
import { axiosClient } from "../utils/AxiosClient";
import { useMainContext } from "../context/mainContext";

function Login() {
  const [loading, setLoading] = useState(false);
  const { fetchUserProfile } = useMainContext();

  const onSubmitHandler = async (values, helpers) => {
    try {
      setLoading(true);
      const response = await axiosClient.post("/api/auth/login", values);
      const data = await response.data;
      localStorage.setItem("accessToken", data?.accessToken);
      localStorage.setItem("token", data?.refreshToken);
      fetchUserProfile();
      helpers.resetForm();
    } catch (error) {
      toast.error(error?.response?.data?.msg || error?.message);
    } finally {
      setLoading(false);
    }
  };

  const initialValues = {
    email: "",
    password: ""
  };

  const validationSchema = yup.object({
    email: yup
      .string()
      .required("Email is Required")
      .email("Email must be valid"),
    password: yup.string().required("Password is Required")
  });

  return (
    <>
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-full xl:w-[40%] mx-10 xl:mx-0 py-10 flex items-start  rounded-md shadow-lg  shadow-[#004aa3]">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmitHandler}
          >
            <Form className="w-full  px-10 py-10  lg:mx-10 ">
              <p className="text-center pb-8 font-bold text-2xl underline">
                Login
              </p>

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
                  text="Login"
                  type="submit"
                />
              </div>
            </Form>
          </Formik>
        </div>
      </div>
    </>
  );
}

export default Login;
