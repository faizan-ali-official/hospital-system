import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import CustomAuthButton from "../components/customButton";
import { axiosClient } from "../utils/AxiosClient";
import { useMainContext } from "../context/mainContext";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../components/input/passwordInput";

const fieldClass =
  "input w-full h-10 py-0 px-3 rounded-lg border border-slate-200 dark:border-slate-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm outline-none focus:border-[#004aa3] dark:focus:border-sky-400 focus:ring-2 focus:ring-[#004aa3]/20 dark:focus:ring-sky-400/20";

function UserCreate() {
  const [loading, setLoading] = useState(false);
  const { allUsers, setAllUsers } = useMainContext();
  const navigate = useNavigate();

  const onSubmitHandler = async (values, helpers) => {
    try {
      setLoading(true);
      const data = await axiosClient.post("/api/user/", values);
      allUsers.push({
        ...data?.data,
        role_name: values.roleId === "1" ? "admin" : "user"
      });
      setAllUsers(allUsers);
      navigate("/users");
      helpers.resetForm();
      toast.success("User created successfully!");
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    } finally {
      setLoading(false);
    }
  };

  const initialValues = {
    username: "",
    email: "",
    password: "",
    roleId: ""
  };

  const validationSchema = yup.object({
    username: yup
      .string()
      .required("Name is required")
      .min(2, "Name must be at least 2 characters"),
    email: yup
      .string()
      .required("Email is required")
      .email("Email must be valid"),
    roleId: yup
      .string()
      .required("Role is required")
      .oneOf(["1", "2"], "Invalid role"),
    password: yup.string().required("Password is required")
  });

  return (
    <div className="flex justify-center min-h-0 flex-1">
      <div className="w-full xl:w-[95%] max-w-2xl flex flex-col overflow-hidden">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Create User</h2>
        <div className="rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 p-6 shadow-sm">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmitHandler}
          >
            <Form className="space-y-3">
              <div>
                <Field
                  placeholder="Name"
                  type="text"
                  name="username"
                  className={fieldClass}
                />
                <ErrorMessage
                  name="username"
                  className="mt-1 text-xs text-red-500"
                  component="p"
                />
              </div>
              <div>
                <Field
                  placeholder="Email"
                  type="text"
                  name="email"
                  className={fieldClass}
                />
                <ErrorMessage
                  name="email"
                  className="mt-1 text-xs text-red-500"
                  component="p"
                />
              </div>
              <div>
                <Field name="roleId">
                  {({ field }) => (
                    <select
                      {...field}
                      className={`${fieldClass} ${field.value ? "text-slate-800" : "text-slate-400"}`}
                    >
                      <option value="">Select Role</option>
                      <option value="1">Admin</option>
                      <option value="2">User</option>
                    </select>
                  )}
                </Field>
                <ErrorMessage
                  name="roleId"
                  className="mt-1 text-xs text-red-500"
                  component="p"
                />
              </div>
              <div>
                <Field
                  name="password"
                  component={PasswordInput}
                  placeholder="Password"
                  inputClassName={`${fieldClass} pl-10 pr-10`}
                />
                <ErrorMessage
                  name="password"
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

export default UserCreate;
