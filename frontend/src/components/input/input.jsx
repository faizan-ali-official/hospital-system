import { ErrorMessage, Field } from "formik";
import React from "react";

function Input({ placeholder, type, name, errorName, label, ...props }) {
  return (
    <div
      className={`mb-3 w-full`}
      style={{
        marginTop: label ? "-24px" : "0"
      }}
    >
      {label && (
        <label className="block mb-1 text-sm text-gray-600">{label}</label>
      )}
      <Field
        placeholder={placeholder}
        type={type || "text"}
        name={name}
        className="input w-full py-3 px-3 rounded border outline-none"
        {...props}
      />
      {errorName && (
        <ErrorMessage name={errorName} className="text-red-500" component="p" />
      )}
    </div>
  );
}
export default Input;
