import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import CustomAuthButton from "../customButton";
import { axiosClient } from "../../utils/AxiosClient";
import { useMainContext } from "../../context/mainContext";

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
      console.log(error);
      toast.error(error?.response?.data?.msg || error?.message);
    } finally {
      setLoading(false);
    }
  };
  const initialValues = {
    name: user.name || "",
    email: user.email || "",
    roleId: user.role_name === "admin" ? "1" : "2",
    password: ""
  };
  console.log(allUsers);
  const validationSchema = yup.object({
    name: yup.string().required("Name is required").min(2),
    email: yup.string().email("Invalid email").required("Email is required"),
    roleId: yup.string().required("Role is required").oneOf(["1", "2"]),
    password: yup
      .string()
      .transform((value) => (value === "" ? undefined : value)) // remove empty string
      .optional()
      .min(6, "Password must be at least 6 characters")
  });

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded shadow-lg relative">
        <button
          className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
          onClick={onClose}
        >
          &times;
        </button>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmitHandler}
          enableReinitialize
        >
          <Form>
            <p className="text-center font-bold text-xl mb-6 underline">
              Update User
            </p>

            <div className="mb-3">
              <Field
                name="name"
                placeholder="Name"
                className="w-full py-2 px-3 border rounded outline-none"
              />
              <ErrorMessage
                name="name"
                component="p"
                className="text-red-500"
              />
            </div>
            <div className="mb-3">
              <Field
                name="email"
                placeholder="Email"
                className="w-full py-2 px-3 border rounded outline-none"
                disabled
              />
              <ErrorMessage
                name="email"
                component="p"
                className="text-red-500"
              />
            </div>
            <div className="mb-3">
              <Field
                name="roleId"
                as="select"
                className="w-full py-2 px-3 border rounded outline-none"
              >
                <option value="">Role</option>
                <option value="1">Admin</option>
                <option value="2">User</option>
              </Field>
              <ErrorMessage
                name="roleId"
                component="p"
                className="text-red-500"
              />
            </div>
            <div className="mb-5">
              <Field
                name="password"
                type="password"
                placeholder="New Password (optional)"
                className="w-full py-2 px-3 border rounded outline-none"
              />
              <ErrorMessage
                name="password"
                component="p"
                className="text-red-500"
              />
            </div>
            <div className="text-center">
              <CustomAuthButton
                isLoading={loading}
                text="Update"
                type="submit"
              />
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
}

export default UserUpdateModal;
