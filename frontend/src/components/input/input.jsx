import { ErrorMessage, Field } from "formik";
import React from "react";

function Input({ placeholder, type, name, errorName }) {
  return (
    <div className="mb-3">
      <Field
        placeholder={placeholder}
        type={type || "text"}
        name={name}
        className="input w-full py-3 px-3 rounded border outline-none"
      />
      <ErrorMessage name={errorName} className="text-red-500" component="p" />
    </div>
  );
}
export default Input;
