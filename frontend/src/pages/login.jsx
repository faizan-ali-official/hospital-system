import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import { HiOutlineUser } from "react-icons/hi2";
import CustomAuthButton from "../components/customButton";
import { axiosClient } from "../utils/AxiosClient";
import { useMainContext } from "../context/mainContext";
import PasswordInput from "../components/input/passwordInput";
import Logo from "../assets/logo.jpeg";

const loginInputClass =
  "w-full py-3 pl-11 pr-4 rounded-lg border border-slate-200 bg-white text-slate-800 placeholder-slate-400 outline-none transition-all duration-200 focus:border-[#004aa3] focus:ring-2 focus:ring-[#004aa3]/20";

function Login() {
  const [loading, setLoading] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const { fetchUserProfile } = useMainContext();

  const onSubmitHandler = async (values, helpers) => {
    try {
      setLoading(true);
      const response = await axiosClient.post("/api/auth/login", values);
      const data = await response.data;
      localStorage.setItem("accessToken", data?.accessToken);
      localStorage.setItem("user", JSON.stringify(data?.user));
      await fetchUserProfile();
      helpers.resetForm();
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || error?.message);
    } finally {
      setLoading(false);
    }
  };

  const initialValues = {
    username: "",
    password: ""
  };

  const validationSchema = yup.object({
    username: yup
      .string()
      .required("This field is required")
      .test("email-or-username", "Invalid email or username", function (value) {
        if (!value) return false;
        if (value.includes("@")) {
          return yup.string().email("Email must be valid").isValidSync(value);
        }
        return yup
          .string()
          .min(3, "Username must be at least 3 characters")
          .matches(/^[a-zA-Z0-9._-]+$/, "Username is not valid")
          .isValidSync(value);
      }),
    password: yup.string().required("Password is Required")
  });

  return (
    <div className="min-h-screen flex">
      {/* Left column - Branding */}
      <div className="hidden lg:flex lg:w-[50%] xl:w-[55%] relative bg-gradient-to-br from-[#004aa3] via-[#003d82] to-[#002a5c] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-80 h-80 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-32 right-20 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-white/20 rounded-full blur-2xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-between p-10 xl:p-14">
          <div>
            <img
              src={Logo}
              alt="Malik Medical Health Center"
              className="h-12 w-12 rounded-lg object-cover bg-white shadow-lg"
            />
            <h1 className="mt-10 text-3xl xl:text-4xl font-bold text-white leading-tight max-w-md">
              Welcome to Malik Medical Health Center
            </h1>
            <p className="mt-6 text-lg text-blue-100/90 max-w-md leading-relaxed">
              Transform your care operations with an intelligent platform built for efficiency, insight, and patient care.
            </p>
          </div>
          <p className="text-sm text-blue-100/70 max-w-md">
            By signing in you agree to our Terms of Service and acknowledge our Privacy Policy describing how we handle your data.
          </p>
        </div>
      </div>

      {/* Right column - Login form */}
      <div className="w-full lg:w-[50%] xl:w-[45%] flex flex-col items-center justify-center bg-white px-6 sm:px-12 py-12">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-slate-800 text-center">
            Sign In
          </h2>
          <p className="text-slate-500 text-center mt-2 mb-8">
            Sign in to your account
          </p>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmitHandler}
          >
            <Form className="space-y-5">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Email
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <HiOutlineUser className="w-5 h-5" />
                  </span>
                  <Field
                    id="username"
                    placeholder="Enter your email or username"
                    type="text"
                    name="username"
                    className={loginInputClass}
                  />
                </div>
                <ErrorMessage
                  name="username"
                  className="text-red-500 text-sm mt-1"
                  component="p"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Password
                </label>
                <Field
                  name="password"
                  component={PasswordInput}
                  inputClassName={loginInputClass}
                  placeholder="Enter your password"
                />
                <ErrorMessage
                  name="password"
                  className="text-red-500 text-sm mt-1"
                  component="p"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={keepSignedIn}
                    onChange={(e) => setKeepSignedIn(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#004aa3] focus:ring-[#004aa3]"
                  />
                  <span className="text-sm text-slate-700">Keep me signed in</span>
                </label>
                <a
                  href="#"
                  className="text-sm text-[#004aa3] hover:underline font-medium"
                >
                  Forgot Password?
                </a>
              </div>

              <div className="pt-1">
                <CustomAuthButton
                  isLoading={loading}
                  text="Sign In"
                  type="submit"
                  className="!rounded-lg !py-3.5 !text-base font-semibold w-full"
                />
              </div>

              <p className="text-center text-sm text-slate-600 pt-2">
                Don&apos;t have an account?{" "}
                <a href="#" className="text-[#004aa3] font-medium hover:underline">
                  Sign Up
                </a>
              </p>
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default Login;
