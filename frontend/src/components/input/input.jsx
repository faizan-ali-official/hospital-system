import { ErrorMessage, Field } from "formik";
import React from "react";

function Input({ placeholder, type, name, errorName, label, showLabel = true, compact = false, className = "", ...props }) {
  return (
    <div className={`w-full ${compact ? "mb-0" : "mb-3"}`}>
      {showLabel && label && (
        <label className="block mb-1 text-sm text-gray-600">{label}</label>
      )}
      <Field
        placeholder={placeholder}
        type={type || "text"}
        name={name}
        className={`input w-full py-3 px-3 rounded-lg border border-slate-200 outline-none ${className}`}
        {...props}
      />
      {errorName && (
        <ErrorMessage name={errorName} className="text-red-500" component="p" />
      )}
    </div>
  );
}
export default Input;
