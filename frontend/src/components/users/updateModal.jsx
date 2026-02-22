import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import { HiXMark } from "react-icons/hi2";
import CustomAuthButton from "../customButton";
import { axiosClient } from "../../utils/AxiosClient";
import { useMainContext } from "../../context/mainContext";
import PasswordInput from "../input/passwordInput";

const slipFieldClass =
  "input w-full h-10 py-0 px-3 rounded-lg border border-slate-200 text-sm outline-none focus:border-[#004aa3] focus:ring-2 focus:ring-[#004aa3]/20";

function UserUpdateModal({ user, onClose, setShowUpdateModal }) {
  const [loading, setLoading] = useState(false);
  const { allUsers, setAllUsers } = useMainContext();

  const onSubmitHandler = async (values) => {
    const payload = { ...values };
    if (!payload.password) {
      delete payload.password;
    }
    try {
      setLoading(true);
      const data = await axiosClient.put(`/api/user/${user.id}`, payload);
      const updatedData = allUsers.map((item) =>
        item.id === user.id ? data?.data?.updatedUser : item
      );
      toast.success("User updated successfully!");
      setAllUsers(updatedData);
      setShowUpdateModal(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    } finally {
      setLoading(false);
    }
  };

  const initialValues = {
    name: user.name || user.username || "",
    email: user.email || "",
    roleId: user.role_name === "admin" ? "1" : "2",
    password: ""
  };

  const validationSchema = yup.object({
    name: yup.string().required("Name is required").min(2),
    email: yup.string().email("Invalid email").required("Email is required"),
    roleId: yup.string().required("Role is required").oneOf(["1", "2"]),
    password: yup
      .string()
      .transform((value) => (value === "" ? undefined : value))
      .optional()
      .min(6, "Password must be at least 6 characters")
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200/80 bg-white shadow-xl">
        {/* Header - same as slip update modal */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-xl font-bold text-slate-800">Edit User</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <HiXMark className="w-5 h-5" />
          </button>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmitHandler}
          enableReinitialize
        >
          <Form className="px-6 py-5">
            <div className="space-y-3">
              <div>
                <Field
                  name="name"
                  placeholder="Name"
                  className={slipFieldClass}
                />
                <ErrorMessage
                  name="name"
                  component="p"
                  className="mt-1 text-xs text-red-500"
                />
              </div>
              <div>
                <Field
                  name="email"
                  placeholder="Email"
                  className={`${slipFieldClass} bg-slate-50 cursor-not-allowed`}
                  disabled
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="mt-1 text-xs text-red-500"
                />
              </div>
              <div>
                <Field name="roleId">
                  {({ field }) => (
                    <select
                      {...field}
                      className={`${slipFieldClass} ${field.value ? "text-slate-800" : "text-slate-400"}`}
                    >
                      <option value="">Select Role</option>
                      <option value="1">Admin</option>
                      <option value="2">User</option>
                    </select>
                  )}
                </Field>
                <ErrorMessage
                  name="roleId"
                  component="p"
                  className="mt-1 text-xs text-red-500"
                />
              </div>
              <div>
                <Field
                  name="password"
                  component={PasswordInput}
                  placeholder="New password (optional)"
                  inputClassName={`${slipFieldClass} pl-10 pr-10`}
                />
                <ErrorMessage
                  name="password"
                  component="p"
                  className="mt-1 text-xs text-red-500"
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="h-10 rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                Cancel
              </button>
              <CustomAuthButton
                isLoading={loading}
                text="Update"
                type="submit"
                className="!h-10 !rounded-lg !py-0 !text-sm"
              />
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
}

export default UserUpdateModal;
