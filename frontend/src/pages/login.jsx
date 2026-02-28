import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { HiOutlineUser, HiSun, HiMoon } from "react-icons/hi2";
import CustomAuthButton from "../components/customButton";
import { axiosClient } from "../utils/AxiosClient";
import { useMainContext } from "../context/mainContext";
import PasswordInput from "../components/input/passwordInput";
import Logo from "../assets/logo.jpeg";

const loginInputClass =
  "w-full py-3 pl-11 pr-4 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all duration-200 focus:border-[#004aa3] dark:focus:border-sky-400 focus:ring-2 focus:ring-[#004aa3]/20 dark:focus:ring-sky-400/20";

function Login() {
  const [loading, setLoading] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const navigate = useNavigate();
  const { fetchUserProfile, theme, setTheme } = useMainContext();

  const onSubmitHandler = async (values, helpers) => {
    try {
      setLoading(true);
      const response = await axiosClient.post("/api/auth/login", values);
      const data = await response.data;
      localStorage.setItem("accessToken", data?.accessToken);
      localStorage.setItem("user", JSON.stringify(data?.user));
      await fetchUserProfile();
      helpers.resetForm();
      navigate("/", { replace: true });
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
        <div className="relative z-10 w-full flex flex-col justify-between p-10 xl:p-14">
          <div></div>
          <div className="">
            <img
              src={Logo}
              alt="Malik Medical Health Center"
              className="h-15 w-15 rounded-lg object-cover bg-white shadow-lg"
            />
            <h1 className="mt-10 text-3xl xl:text-4xl font-bold text-white">
              Welcome to Malik Medical Health Center
            </h1>
            <p className="mt-6 text-lg text-blue-100/90 max-w-md leading-relaxed">
              Transform your care operations with an intelligent platform built
              for efficiency, insight, and patient care.
            </p>
          </div>
          <p className="text-sm text-blue-100/70 max-w-md">
            By signing in you agree to our Terms of Service and acknowledge our
            Privacy Policy describing how we handle your data.
          </p>
        </div>
      </div>

      {/* Right column - Login form */}
      <div className="w-full lg:w-[50%] xl:w-[45%] flex flex-col items-center justify-center bg-white dark:bg-slate-900 px-6 sm:px-12 py-12 relative">
        <button
          type="button"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? <HiSun className="w-5 h-5" /> : <HiMoon className="w-5 h-5" />}
        </button>
        <div className="w-full ">
          <h2 className="text-3xl font-bold text-[#004aa3] dark:text-sky-400">Sign In</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 mb-8 italic">
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
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
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
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
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
              <div className="pt-1 mt-10">
                <CustomAuthButton
                  isLoading={loading}
                  text="Sign In"
                  type="submit"
                  className="!rounded-lg !py-3.5 !text-base font-semibold w-full"
                />
              </div>
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default Login;
