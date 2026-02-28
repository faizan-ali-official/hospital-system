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
        className={`input w-full py-3 px-3 rounded-lg border border-slate-200 dark:border-slate-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-[#004aa3] dark:focus:border-sky-400 focus:ring-2 focus:ring-[#004aa3]/20 dark:focus:ring-sky-400/20 ${className}`}
        {...props}
      />
      {errorName && (
        <ErrorMessage name={errorName} className="text-red-500" component="p" />
      )}
    </div>
  );
}
export default Input;
